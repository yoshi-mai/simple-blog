const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(express.json());
app.use(cors());

const port = 4002;

// Hold our data
const posts = {};

const handleEvent = (type, data) => {
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
        // Update that comments properties. Remember, we do not have to store these objects back into the array, because it already exists there.
        comment.status = status;
        comment.content = content;
    }
}

//Routes
app.get('/posts', async (req, res) => {
    res.send(posts);
});

app.post('/events', (req, res) => {
    const { type, data } = req.body;

    handleEvent(type, data);

    res.send({});
});

app.listen(port, async () => {
    console.log("QueryService is listening on port %s", port);

    // Get all events from the event bus event store to sync
    try {
        const res = await axios.get("http://localhost:4005/events");
     
        for (let event of res.data) {
          console.log("Processing event:", event.type);
     
          handleEvent(event.type, event.data);
        }
      } catch (error) {
        console.log(error.message);
      }
});