import {useState, useEffect, useRef} from "react"
import { Link, useParams, useLocation } from "react-router-dom";
import axios from 'axios';
import "./PostPage.css"


function Reply({comment, SetCommentRef, currentUser, setCurrentUser, last, AddReply})
{

    const [voteState,setVoteState] = useState(CheckUserVote());
    const [likes,setLikes] = useState(comment.likes);
    const [dislikes,setDislikes] = useState(comment.dislikes);

    const [saved,setSaved] = useState(currentUser.savedPosts.includes(comment.id));

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

    function handleSave()
    {
        console.log("yea");
        setSaved(prev => !prev);

        let updatedUser = currentUser;

        if(updatedUser.savedPosts.includes(comment.id))
        {
        updatedUser.savedPosts = updatedUser.savedPosts.filter((savedPost)=>savedPost!==comment.id);
        }
        else
        {
        updatedUser.savedPosts = [...updatedUser.savedPosts,comment.id];
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

    function FormatText(replyText)
    {
        let replyTextSplit = replyText.split(' ').map((word)=> word[0]==='@' ? <Link className="user-tag">{word}&nbsp;</Link> : word+" ");
        console.log(replyTextSplit);
        return replyTextSplit;
    }


    return (
        <div className="post-page-comment-content-container" id={comment.id}>
            <p className="post-page-comment-info">By {comment.user} at {new Date(comment.date).toDateString()} {new Date(comment.date).toLocaleTimeString()} </p>
            <p className="post-page-comment-text" ref={SetCommentRef(comment.id)} parentcommentid={comment.parentComment} reply="true">{FormatText(comment.text)}</p>

            <div className="comment-bottom-bar flex-row">
                <div className="comment-options flex-row">
                <div className="comment-votes-container flex-row">
                    <button className="comment-voting-button flex-row" vote={voteState==="like" ? "like" : "none"} onClick={function(){handleVote("like")}} ><i className='bx bxs-like voting-icon'></i>{(likes)}</button>
                    <button className="comment-voting-button flex-row" vote={voteState==="dislike" ? "dislike" : "none"} onClick={function(){handleVote("dislike")}} ><i className='bx bxs-dislike voting-icon' ></i>{(dislikes)}</button>
                </div>
                <button className="comment-reply-button flex-row" onClick={function(){AddReply(comment.user)}}><i className='bx bxs-comment-detail comment-icon'></i>Reply</button>
                <button className="comment-save-button flex-row" saved={saved ? "true" : "false"}  onClick={handleSave}><i className='bx bxs-save voting-icon'></i>{saved ? "Saved" : "Save"}</button>
                </div>
            </div>
            <div className="reply-pointer-line"></div>
            <div className="post-page-comment-replies-line" last={last}></div>
        </div>
           
    )
}

function Comment({comment, SetCommentRef, currentUser, setCurrentUser, setComments, replyList})
{

    const [newReply,setNewReply] = useState("");

    const [voteState,setVoteState] = useState(CheckUserVote());
    const [likes,setLikes] = useState(comment.likes);
    const [dislikes,setDislikes] = useState(comment.dislikes);

    const [replies,setReplies] = useState(replyList);

    const [saved,setSaved] = useState(currentUser.savedPosts.includes(comment.id));

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

    function handleReply(event)
    {
        setNewReply(event.target.value);
    }

    function submitReply(event)
    {
        event.preventDefault();

        if(newReply!=="")
        {

            let replyToAdd = {
                id: "comment-"+makeId(10),
                text: newReply,
                user: currentUser.username,
                post: comment.post,
                date: Date.now(),
                likes: 0,
                dislikes: 0,
                parentComment: comment.id
            }

            fetch('http://localhost:8000/comments',{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(replyToAdd)
            }).then(()=>{
                console.log("New Reply Added.");
                setNewReply("");
        setComments(prev => [...prev,replyToAdd]);
            })
        }
    }


    const replyInput = useRef();

    function MentionReply(userMention)
    {
        replyInput.current.scrollIntoView({
            behavior: 'auto',
            block: 'center',
            inline: 'center'
        });

        setNewReply("@"+userMention+" ");

        replyInput.current.focus();

    }

    function handleSave()
    {
        console.log("yea");
        setSaved(prev => !prev);

        let updatedUser = currentUser;

        if(updatedUser.savedPosts.includes(comment.id))
        {
            updatedUser.savedPosts = updatedUser.savedPosts.filter((savedPost)=>savedPost!==comment.id);
        }
        else
        {
            updatedUser.savedPosts = [...updatedUser.savedPosts,comment.id];
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

    function FormatText(replyText)
    {
        let replyTextSplit = replyText.split(' ').map((word)=> word[0]==='@' ? <Link className="user-tag">{word}&nbsp;</Link> : word+" ");
        console.log(replyTextSplit);
        return replyTextSplit;
    }

    
    function AutoResize(event)
    {
        console.log(event.target.getAttribute("minheight"))
        event.target.style.minHeight = 0;
        event.target.style.minHeight = "max(" + event.target.getAttribute("minheight") + "px,"+(event.target.scrollHeight) + "px)" ;
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


    return (
        <div className="post-page-comment-container">
            <input id={"reply-checkbox-"+comment.id} type="checkbox" className="post-page-comment-reply-checkbox hidden-checkbox"/>        
            <div className="post-page-comment-content-container" id={comment.id} ref={SetCommentRef(comment.id)}>
                <p className="post-page-comment-info">By {comment.user} at {new Date(comment.date).toDateString()} {new Date(comment.date).toLocaleTimeString()} </p>
                <p className="post-page-comment-text">{FormatText(comment.text)}</p>

                <div className="comment-bottom-bar flex-row">
                    <div className="comment-options flex-row">
                    <div className="comment-votes-container flex-row">
                        <button className="comment-voting-button flex-row" vote={voteState==="like" ? "like" : "none"} onClick={function(){handleVote("like")}} ><i className='bx bxs-like voting-icon'></i>{(likes)}</button>
                        <button className="comment-voting-button flex-row" vote={voteState==="dislike" ? "dislike" : "none"} onClick={function(){handleVote("dislike")}} ><i className='bx bxs-dislike voting-icon' ></i>{(dislikes)}</button>
                    </div>
                    <label htmlFor={"reply-checkbox-"+comment.id} className="comment-reply-button flex-row"><i className='bx bxs-comment-detail comment-icon'></i>Replies({replyList.length})<i className='bx bxs-down-arrow reply-arrow-icon'></i></label>
                    <button className="comment-save-button flex-row" saved={saved ? "true" : "false"}  onClick={handleSave}><i className='bx bxs-save voting-icon'></i>{saved ? "Saved" : "Save"}</button>
                    </div>
                </div>
            </div>
            <div className="post-page-comment-replies-container">
                <div className="post-page-comment-replies-section reply-margin flex-column">
                    <form className="post-page-write-reply-form flex-row" onSubmit={submitReply}>
                        <textarea className="post-page-write-reply-input" ref={replyInput} placeholder="Write your reply..." minheight={100} value={newReply} onInput={AutoResize} onChange={handleReply}></textarea>
                        <input className="post-page-write-reply-submit" type="submit" value="Reply" />
                        <div className="post-page-comment-replies-line" first="true"></div>

                    </form>
                    <div>
                        {
                            replyList && replyList.map((reply,index)=>
                            <Reply comment={reply} SetCommentRef={SetCommentRef} currentUser={currentUser} setCurrentUser={setCurrentUser} AddReply={MentionReply} key={reply.id} last={index===replyList.length-1 ? "true" : "false"} />
                            )
                        }
                    </div>
                </div>
              
            </div>
        
           
        </div>
    )
}

export default Comment;