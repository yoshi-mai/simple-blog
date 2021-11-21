import React from 'react';

const CommentList = ({ comments }) => {
    const renderedComments = Object.values(comments).map(comment => {

        // Check if the comment got approved or rejected and change the content rendered if needed.
        let content;

        if (comment.status === 'approved') {
            content = comment.content;
        }

        if (comment.status === 'pending') {
            content = 'This comment is awaiting moderation.';
        }

        if (comment.status === 'rejected') {
            content = 'This comment contained illegal words.';
        }


        return <li key={comment.id}>{content}</li>; // a <li> needs a key in React, to help identify which items have changed, are added or removed
    });

    return <div>
        <ul>
            {renderedComments}
        </ul>
    </div>;
};

export default CommentList;