const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');

const app = express();
// Middleware for service
app.use(bodyParser.json());
app.use(cors());

const port = 4000;

const posts = {};

// Routes
app.get("/posts", (req, res) => {
    res.send(posts);
});

app.post('/posts', (req, res) => {
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;

    posts[id] = {
        id, title
    };

    res.status(201).send(posts[id]);
});




// Port
app.listen(port, () => {
    console.log("PostsService is listening on %s.", port);
});

