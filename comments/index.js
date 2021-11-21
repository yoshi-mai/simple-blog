const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');


const app = express();

// Middleware for service
app.use(express.json());
app.use(cors());

const port = 4001;

const commentsByPostId = {};

// Routes
app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || [] );
});

app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body; // save the content of the request as the content of the comment (user input of the text field)

    const comments = commentsByPostId[req.params.id] || []; // get an array of all comments already created on the post

    // Create the new comment and push it to the array of comments associated with the postId
    comments.push({
        id: commentId, content, status: 'pending' // default status should always be 'pending'
    });

    commentsByPostId[req.params.id] = comments; // save all the comments of the post including the new one

    // Create the CommentCreated Event to post it to the event bus
    await axios.post('http://localhost:4005/events', {
        type:"CommentCreated",
        data: {
            id: commentId,
            content,
            postId: req.params.id,
            status: 'pending'
        },
    });

    res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
    console.log("Event Received:", req.body.type);
    const { type, data } = req.body;

    // Check for any incoming CommentModerated events and see if they got recejted or not. If they got rejected, we change the content of them.
    if (type === 'CommentModerated') {
        const { postId, id, status, content } = data;
        // Find the comment which got moderated in our commentsByPostId "datasave"
        const comments = commentsByPostId[postId];
        const comment = comments.find((comment) => {
            return comment.id === id;
        });
        // Update the comments status. We do not need to reinsert the comment into the array, because it is the same object in memory.
        comment.status = status;
        
        // Emit a CommentUpdated event to the event bus, so our query service knows that a comment got changed
        await axios.post('http://localhost:4005/events', {
            type: 'CommentUpdated',
            data: {
                id,
                status,
                postId,
                content
            }
        });
    }

    res.send({});
})



app.listen(port, () => {
    console.log("CommentsService is listening on port %s.", port);
});