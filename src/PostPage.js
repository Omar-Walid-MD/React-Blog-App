import {useState, useEffect, useRef} from "react"
import { Link, useParams, useLocation } from "react-router-dom";
import axios from 'axios';

import Header from "./Header";
import Post from "./Post";
import Comment from "./Comment";
import './MainPage.css';
import "./PostPage.css";

function PostPage({currentUser,setCurrentUser})
{

    let postId = useParams().id;

    const location = useLocation();
    const {targetCommentId} = location.state || {};

    const targetComment = useRef(null);


    // if(targetComment) ScrollToComment();

    const [post,setPost] = useState(null);

    const [voteState,setVoteState] = useState("none");
    const [likes,setLikes] = useState(0);
    const [dislikes,setDislikes] = useState(0);

    const [newComment,setNewComment] = useState("");

    const [comments,setComments] = useState([]);

    const [saved,setSaved] = useState();

    function handleComment(event)
    {
        setNewComment(event.target.value);
    }

    function submitComment(event)
    {
        event.preventDefault();

        if(newComment!=="")
        {

            let commentToAdd = {
                id: "comment-"+makeId(10),
                text: newComment,
                user: currentUser.username,
                post: postId,
                date: Date.now(),
                likes: 0,
                dislikes: 0
            }

            fetch('http://localhost:8000/comments',{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(commentToAdd)
            }).then(()=>{
                console.log("New Comment Added.");
                setNewComment("");
                setComments(prev => [...prev,commentToAdd]);
            })
        }
    }
    
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

    function handleSave()
  {
    console.log("yea");
    setSaved(prev => !prev);

    let updatedUser = currentUser;

    if(updatedUser.savedPosts.includes(post.id))
    {
      updatedUser.savedPosts = updatedUser.savedPosts.filter((savedPost)=>savedPost!==post.id);
    }
    else
    {
      updatedUser.savedPosts = [...updatedUser.savedPosts,post.id];
    }

    axios.put('http://localhost:8000/users/'+updatedUser.id,
      updatedUser
    )
    .then(resp =>{
        console.log("Updated User Saved Posts");
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
    }).catch(error => {
        console.log(error);
    });


  }

    function CheckUserVote()
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

    function GetPostComments(commentList)
    {
        return commentList.filter((comment)=>comment.post===postId);
    }

    function SetTargetComment(targetCommentId,commentId)
    {
        console.log(targetCommentId===commentId);
        return targetCommentId===commentId ? targetComment : null;
    }

    function ScrollToComment()
    {
        console.log("Scrolled");
        targetComment.current.scrollIntoView();
    }

    function makeId(length)
    {
        let result = "";
        let chars = "123456789";
        for (var i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * 9)];
        }
        return result;
    }


    useEffect(()=>{

        window.scrollTo(0,0);    
            
        fetch('http://localhost:8000/posts/'+postId)
        .then(res => {
        return res.json()
        })
        .then((data)=>{

            setPost(data);
            setVoteState(CheckUserVote(data));
            setLikes(data.likes);
            setDislikes(data.dislikes);
        });

        fetch('http://localhost:8000/comments/')
        .then(res => {
        return res.json()
        })
        .then((data)=>{

            setComments(GetPostComments(data));
        });
        

    },[postId]);

    useEffect(()=>{
        if(post) 
        {
            setVoteState(CheckUserVote());
            setSaved(currentUser.savedPosts.includes(post.id));
        }

    },[post])


    useEffect(()=>{
        if(targetComment.current) ScrollToComment();
    },[targetComment.current]);

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
                                <button className="save-button flex-row" saved={saved ? "true" : "false"}  onClick={handleSave}><i className='bx bxs-save voting-icon'></i>{saved ? "Saved" : "Save"}</button>
                            </div>
                        </div>
                        <div className="post-page-comments-section-container">
                            {
                                currentUser ?
                                <form className="post-page-write-comment-form flex-column" onSubmit={submitComment}>
                                    <textarea className="post-page-write-comment-input" placeholder="Write your comment..." value={newComment} onChange={handleComment}></textarea>
                                    <input className="post-page-write-comment-submit" type="submit" value="Comment" />
                                </form>
                                :
                                <div className="post-page-comment-logged-out-warning">
                                    You must be logged in to comment!
                                </div>
                            }
                            <div className="post-page-comments-section">
                                {
                                    comments && comments.map((comment)=>
                                    <Comment comment={comment} key={comment.id} commentRef={SetTargetComment(targetCommentId,comment.id)} currentUser={currentUser} setCurrentUser={setCurrentUser} />
                                    )
                                }
                            </div>
                        </div>
                    
                </div>
            }
          </div>
        </div>
      );
}

export default PostPage;