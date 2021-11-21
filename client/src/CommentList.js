import React from 'react';

const CommentList = ({ comments }) => {
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