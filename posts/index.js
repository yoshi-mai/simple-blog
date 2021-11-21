const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
// Middleware for service
app.use(express.json());
app.use(cors());

const port = 4000;

const posts = {};

// Routes
app.get("/posts", (req, res) => {
    res.send(posts);
});

app.post('/posts', async (req, res) => {
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;

    posts[id] = {
        id, title
    };

    // Emit an event to the event bus when a new post gets created
    await axios.post('http://localhost:4005/events', {
        type: 'PostCreated',
        data: {
            id, title
        }
    }); 

    res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
    console.log('Received Event:', req.body);

    res.send({}); 
})




// Port
app.listen(port, () => {
    console.log("PostsService is listening on %s.", port);
});

