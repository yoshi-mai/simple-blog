import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CommentList = ({ postId }) => {

    // const to save data
    const [comments, setComments] = useState({});

    //fetching data from api
    const fetchComments = async () => {
        const res = await axios.get(`http://localhost:4001/posts/${postId}/comments`);
        setComments(res.data);
    }

    useEffect(() => {
        fetchComments();
    }, []);

    const renderedComments = Object.values(comments).map(comment => {
        return <li key={comment.id}>{comment.content}</li>; // a <li> needs a key in React, to help identify which items have changed, are added or removed
    });

    return <div>
        <ul>
            {renderedComments}
        </ul>
    </div>;
};

export default CommentList;