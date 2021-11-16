const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');

const app = express();

// Middleware for service
app.use(bodyParser.json());
app.use(cors());

const port = 4001;

const commentsByPostId = {};

// Routes
app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || [] );
});

app.post('/posts/:id/comments', (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;

    const comments = commentsByPostId[req.params.id] || [];

    comments.push({
        id: commentId, content
    });

    commentsByPostId[req.params.id] = comments;

    res.status(201).send(comments);
});

app.listen(port, () => {
    console.log("CommentsService is listening on port %s.", port);
});