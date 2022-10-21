import {useState, useEffect, useRef} from "react"
import { Link, useParams, useLocation } from "react-router-dom";
import axios from 'axios';
import "./PostPage.css"

function Comment({comment,commentRef, currentUser, setCurrentUser})
{

    const [voteState,setVoteState] = useState(CheckUserVote());
    const [likes,setLikes] = useState(comment.likes);
    const [dislikes,setDislikes] = useState(comment.dislikes);

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
        
            let updatedComment = {
                ...comment,
                likes: newLikes,
                dislikes: newDislikes,
            }
        
            // const axios = require('axios');
        
            axios.put('http://localhost:8000/comments/'+updatedComment.id,
                updatedComment
            )
            .then(resp =>{
                console.log("Updated Comment likes");
            }).catch(error => {
                console.log(error);
            });
        
            let updatedUser = currentUser;
        
        
            if(newVoteState===voteState)
            {
                if(updatedUser.dislikes.includes(comment.id))
                {
                    updatedUser.dislikes = currentUser.dislikes.filter((disliked)=>disliked!==comment.id)
                }
        
                if(updatedUser.likes.includes(comment.id))
                {
                    updatedUser.likes = currentUser.likes.filter((liked)=>liked!==comment.id);
                }
        
            }
            else
            {
                if(newVoteState==="like")
                {
                    console.log("changed")
                
                    if(updatedUser.dislikes.includes(comment.id))
                    {
                        updatedUser.dislikes = currentUser.dislikes.filter((dislikedPost)=>dislikedPost!==comment.id)
                    }
                    updatedUser.likes = newVoteState==="like" ?  [...updatedUser.likes,comment.id] : updatedUser.likes;
                }
                else if(newVoteState==="dislike")
                {
                    if(updatedUser.likes.includes(comment.id))
                    {
                        updatedUser.likes = currentUser.likes.filter((likedPost)=>likedPost!==comment.id)
                    }
                    updatedUser.dislikes = newVoteState==="dislike" ?  [...updatedUser.dislikes,comment.id] : updatedUser.dislikes;
            
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


    function CheckUserVote()
    {
        if(currentUser)
        {
            let result = "";
            if(currentUser.likes.includes(comment.id)) result = "like";
            else if(currentUser.dislikes.includes(comment.id)) result = "dislike";
            else result = "none";

            return result;
        }
        else
        {
            return "none";
        }
        
    }


    return (
        <div className="post-page-comment-container" id={comment.id} ref={commentRef}>
            <p className="post-page-comment-info">By {comment.user} at {new Date(comment.date).toDateString()} {new Date(comment.date).toLocaleTimeString()} </p>
            <p className="post-page-comment-text">{comment.text}</p>

            <div className="comment-bottom-bar flex-row">
                <div className="comment-options flex-row">
                <div className="comment-votes-container flex-row">
                    <button className="comment-voting-button flex-row" vote={voteState==="like" ? "like" : "none"} onClick={function(){handleVote("like")}} ><i className='bx bxs-like voting-icon'></i>{(likes)}</button>
                    <button className="comment-voting-button flex-row" vote={voteState==="dislike" ? "dislike" : "none"} onClick={function(){handleVote("dislike")}} ><i className='bx bxs-dislike voting-icon' ></i>{(dislikes)}</button>
                </div>
                <Link to={"/post/"} className="comment-reply-button flex-row"><i className='bx bxs-comment-detail comment-icon'></i>Reply</Link>
                <button className="comment-save-button flex-row" ><i className='bx bxs-save voting-icon'></i>Save</button>
                </div>
            </div>
        </div>
    )
}

export default Comment;