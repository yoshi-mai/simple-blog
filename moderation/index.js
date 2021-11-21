const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.json());

const port = 4003;

app.post('/events', async (req, res) => {
    const { type, data } = req.body;

    // Checks for any incoming events of type 'CommentCreated' to moderate them
    if (type === 'CommentCreated') {
    // Check if content of comment contains 'orange' and if so, rejects it.
        const status = data.content.includes('orange') ? 'rejected' : 'approved';
        // Emits a new event of type CommentModerated to the event bus
        await axios.post('http://localhost:4005/events', {
            type: 'CommentModerated',
            data: {
                id: data.id,
                status,
                postId: data.postId,
                content: data.content
            }
        });
    }
    res.send({});
});


app.listen(port, () => {
    console.log('ModerationService is listening on port %s', port);
});