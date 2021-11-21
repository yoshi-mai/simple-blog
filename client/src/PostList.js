import React, { useState, useEffect } from "react";
import axios from "axios";
import CommentCreate from "./CommentCreate";
import CommentList from "./CommentList";

/**
 * What does our PostList component have to do?
 * It needs to create a GET request to our PostsService to get a list of all created Posts and render it.
 */
const PostList = () => {

    // const to save the data we are going to fetch
    const [posts, setPosts ] = useState({}); // we put an empty object as parameter for useState, because our PostsService returns an object.

    // const for our fetching function
    const fetchPosts = async () => {
        const res = await axios.get('http://localhost:4002/posts'); //simple axios get call 

        setPosts(res.data);
    }

    // we need a useEffect hook to let React know when to call our fetchPosts().
    useEffect(() => {
        fetchPosts();
    }, []); // first argument is the function to get Posts and second argument is an empty array, which tells React to only run this function once.

    // we need a function that renders our posts now 
    // Object.values(posts) gives us back an array of all the values in posts. Remember that inside of posts are objects.
    // We then map over that array, and for every post object inside of it, we create JSX code that displays the data of the object.
    const renderedPosts = Object.values(posts).map(post => {
        return <div className="card" 
                    style={{ width: '30%', marginBottom: '20px'}}
                    key={post.id}>
                        <div className="card-body">
                            <h3>{post.title}</h3>
                            <CommentList comments={post.comments} />
                            <CommentCreate postId={post.id} />
                        </div>      
                </div>;
    })
    // we then have to add the renderedPosts function to our return of the overall component, otherwise it won't get rendered.
    return <div className="d-flex flex-row flex-wrap justify-content-between">
        {renderedPosts}
    </div>;
};

export default PostList;