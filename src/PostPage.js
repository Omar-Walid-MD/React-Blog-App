import {useState, useEffect} from "react"
import { Link, useParams } from "react-router-dom";
import axios from 'axios';

import Header from "./Header";
import Post from "./Post";
import './MainPage.css';
import "./PostPage.css";

function PostPage({posts,currentUser,setCurrentUser})
{

    let postId = useParams().id;

    console.log(postId);

    const [post,setPost] = useState(null);


    const [voteState,setVoteState] = useState("none");
    const [likes,setLikes] = useState(0);
    const [dislikes,setDislikes] = useState(0);
    
    function handleVote(newVoteState)
    {
        if(currentUser)
        {

            let newLikes = likes;
            let newDislikes = dislikes;
            
            if(newVoteState===voteState)
            {
                setVoteState("none");
                if(newVoteState==="like")
                {
                setLikes(l => l - 1);
                newLikes--;
                }
                if(voteState==="dislike")
                {
                setDislikes(l => l - 1);
                newDislikes--;
                }
            }
            else
            {
                if(newVoteState==="like")
                {
                if(voteState==="dislike")
                {
                    setDislikes(l => l - 1);
                    newDislikes--;
                }
                setVoteState("like");
                setLikes(l => l + 1);
                newLikes++;
                }
                else if(newVoteState==="dislike")
                {
                if(voteState==="like")
                {
                    setLikes(l => l - 1);
                    newLikes--;
                }
                setVoteState("dislike");
                setDislikes(l => l + 1);
                newDislikes++;
                }
        
            }
        
            let updatedPost = {
                ...post,
                likes: newLikes,
                dislikes: newDislikes,
            }
        
            // const axios = require('axios');
        
            axios.put('http://localhost:8000/posts/'+updatedPost.id,
                updatedPost
            )
            .then(resp =>{
                console.log("Updated Post likes");
            }).catch(error => {
                console.log(error);
            });
        
            let updatedUser = currentUser;
        
        
            if(newVoteState===voteState)
            {
                if(updatedUser.dislikes.includes(post.id))
                {
                updatedUser.dislikes = currentUser.dislikes.filter((dislikedPost)=>dislikedPost!==post.id)
                }
        
                if(updatedUser.likes.includes(post.id))
                {
                updatedUser.likes = currentUser.likes.filter((likedPost)=>likedPost!==post.id);
                console.log("come here");
                }
        
            }
            else
            {
                if(newVoteState==="like")
                {
                console.log("changed")
            
                if(updatedUser.dislikes.includes(post.id))
                {
                    updatedUser.dislikes = currentUser.dislikes.filter((dislikedPost)=>dislikedPost!==post.id)
                }
                updatedUser.likes = newVoteState==="like" ?  [...updatedUser.likes,post.id] : updatedUser.likes;
                }
                else if(newVoteState==="dislike")
                {
                if(updatedUser.likes.includes(post.id))
                {
                    updatedUser.likes = currentUser.likes.filter((likedPost)=>likedPost!==post.id)
                }
                updatedUser.dislikes = newVoteState==="dislike" ?  [...updatedUser.dislikes,post.id] : updatedUser.dislikes;
            
                }
            }
        
            // updatedUser.likes = [];
            // updatedUser.dislikes = [];
        
        
            axios.put('http://localhost:8000/users/'+updatedUser.id,
                updatedUser
            )
            .then(resp =>{
                console.log("Updated User Votes");
                localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                setCurrentUser(updatedUser);
            }).catch(error => {
                console.log(error);
            });
        }
        else
        {
            console.log("Must be logged in to vote!");
        }

    }

    function CheckUserVote(post)
    {
        if(currentUser)
        {
            let result = "";
            if(currentUser.likes.includes(post.id)) result = "like";
            else if(currentUser.dislikes.includes(post.id)) result = "dislike";
            else result = "none";

            return result;
        }
        else
        {
            return "none";
        }
        
    }


    useEffect(()=>{

        window.scrollTo(0,0);
        
        if(posts) 
        {
            let loadedPost = posts.filter((post)=>post.id==postId)[0]
            setPost(loadedPost);

            setVoteState(CheckUserVote(loadedPost));
            setLikes(loadedPost.likes);
            setDislikes(loadedPost.dislikes);
        }

    },[posts,postId]);

    return (
        <div className="main-page">
          <Header currentUser={currentUser} setCurrentUser={setCurrentUser} />
          <div className="page-container flex-center">
            {
                post &&
                <div className="post-page-main-column flex-column">
    
                        <div className="post-page-post-container flex-column">
                            <div className="post-info">
                                <p className="post-page-post-date">posted by {post.user} at {new Date(post.date).toDateString()} {new Date(post.date).toLocaleTimeString()}</p>
                                <h1 className="post-page-post-title">{post.title}</h1>
                                <p className="post-page-post-body">{post.body}</p>
                            </div>        
                        </div>
                        <div className="post-page-post-bottom-bar flex-row">
                            <div className="post-page-post-options flex-row">
                                <div className="post-votes-container flex-row">
                                <button className="voting-button flex-row" vote={voteState==="like" ? "like" : "none"} onClick={function(){handleVote("like")}}><i className='bx bxs-like voting-icon'></i>{(likes)}</button>
                                <button className="voting-button flex-row" vote={voteState==="dislike" ? "dislike" : "none"} onClick={function(){handleVote("dislike")}}><i className='bx bxs-dislike voting-icon' ></i>{(dislikes)}</button>
                                </div>
                                <div>Comments(0)</div>
                                <div>Save</div>
                            </div>
                        </div> 
                    
                </div>
            }
          </div>
        </div>
      );
}

export default PostPage;