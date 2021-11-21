const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const port = 4002;

// Hold our data
const posts = {};

//Routes
app.get('/posts', async (req, res) => {
    res.send(posts);
});

app.post('/events', (req, res) => {
    const { type, data } = req.body;

    if (type === 'PostCreated') {
        const { id, title } = data;

        posts[id] = { id, title, comments: [] };
    }

    if (type === 'CommentCreated') {
        const { id, content, postId, status } = data;

        const post = posts[postId];
        post.comments.push({ id, content, status });
    }

    if (type === 'CommentUpdated') {
        const { id, content, postId, status } = data;

        // Search for the post which is associated with the updated comment.
        const post = posts[postId];
        // Search for the comment which got updated inside of the post.
        const comment = post.comments.find(comment => {
            return comment.id === id;
        });
        console.log('Comment Log before setting: ', comment);
        // Update that comments properties. Remember, we do not have to store these objects back into the array, because it already exists there.
        comment.status = status;
        comment.content = content;
        console.log('Comment Log after setting: ', comment);
    }
    res.send({});
});

app.listen(port, () => {
    console.log("QueryService is listening on port %s", port)
});