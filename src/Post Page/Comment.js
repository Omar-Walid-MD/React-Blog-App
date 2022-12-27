import {useState, useEffect, useRef} from "react"
import { Link, useParams, useLocation } from "react-router-dom";
import axios from 'axios';

import Reply from "./Reply";
import Avatar from "../Main Page/Avatar";

import "../Post Page/PostPage.css"


function Comment({comment, SetCommentRef, targetCommentId, currentUser, setCurrentUser, setComments, replyList, users})
{
    const [user,setUser] = useState();

    const [newReply,setNewReply] = useState("");

    const [post,setPost] = useState();
    const [topic,setTopic] = useState();

    const [voteState,setVoteState] = useState(CheckUserVote());
    const [likes,setLikes] = useState(comment.likes);
    const [dislikes,setDislikes] = useState(comment.dislikes);

    const [targetReplyId,setTargetReplyId] = useState();

    const targetReply = useRef(null);


    const [saved,setSaved] = useState(currentUser && currentUser.savedPosts.includes(comment.id));

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
                user: {username: currentUser.username,id: currentUser.id},
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

                
                ScrollToReply(replyToAdd);
            });

            if(currentUser.id!==comment.user.id)
            {
                fetch('http://localhost:8000/users/'+comment.user.id)
                .then(res => {
                return res.json()
                })
                .then((targetUser)=>{

                    let newNotif = {
                        type: "reply",
                        user: currentUser.id,
                        comment: replyToAdd.id,
                        post: post.id,
                        topic: topic.id
                    }
    
                    SendNotif(newNotif,targetUser);
                    
                });

            }

        }
    }

    function SendNotif(newNotif,targetUser)
    {
        let notifs = [...targetUser.notifs,newNotif];
    
        let updatedUser = {
            ...targetUser,
            notifs: notifs
        }

        axios.put('http://localhost:8000/users/'+updatedUser.id,
        updatedUser
        )
        .then(resp =>{
            console.log("Updated Target User Notifs");
        }).catch(error => {
            console.log(error);
        });
    }


    

    function handleSave()
    {
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

    function SetReplyRef(replyId)
    {
        console.log("is it the target: " + targetReplyId===replyId);
        return targetReplyId===replyId ? targetReply : null;
    }

    //Needs to be fixed
    function ScrollToReply(replyToAdd)
    {
        console.log(targetReply.current);
        setTargetReplyId(replyToAdd.id);

        // while(!targetReply.current)
        // {
        //     setTimeout(() => {}, 100);
        // }

        // setTimeout(() => {}, 500);

        // targetReply.current.scrollIntoView({
        //     behavior: 'smooth',
        //     block: 'center',
        //     inline: 'center'
        // });

        document.querySelector("#"+replyToAdd.id).scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
        });
    }

    function FormatText(replyText)
    {
        let replyTextSplit = replyText.split(' ').map((word)=> word[0]==='@' ? <Link to={"/user/" + GetUserFromName(word.slice(1,word.length)).id} className="user-tag">{word}&nbsp;</Link> : word+" ");
        return replyTextSplit;
    }

    function GetUserFromName(username)
    {
        for (let i = 0; i < users.length; i++)
        {
            const user = users[i];

            console.log(username);
            if(user.username===username)
            {
                console.log(user);
                return user;
            }
            
        }

        return {id: "undefined"};
    }

    function CalculateTime()
    {
        let timeDifference =  new Date() - new Date(comment.date);

        var years = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 365.25));
        var months = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 365.25/12));
        var days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        var hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        if(years > 0)
        {
            return years + (years > 1 ? " years" : " year") + " ago";
        }
        else if(months > 0)
        {
            return months + (months > 1 ? " months" : " month") + " ago";
        }
        else if(days > 0)
        {
            return days + (days > 1 ? " days" : " day") + " ago";
        }
        else if(hours > 0)
        {
            return hours + (hours > 1 ? " hours" : " hour") + " ago";
        }
        else if(minutes > 0)
        {
            return minutes + (minutes > 1 ? " minutes" : " minute") + " ago";
        }
        else if(seconds > 5)
        {
            return seconds + (seconds > 1 ? " seconds" : " second") + " ago";
        }
        else
        {
            return "Now";
        }
    }

    
    function AutoResize(event)
    {
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

    useEffect(()=>{

        if(!user)
        {
            // console.log(comment.user)
            fetch('http://localhost:8000/users/'+comment.user.id)
            .then(res => {
            return res.json()
            })
            .then((data)=>{
            setUser(data);
            // console.log(data);
            })
        }

        if(!post)
        {
            fetch('http://localhost:8000/posts/'+comment.post)
            .then(res => {
            return res.json()
            })
            .then((post)=>{
            setPost(post);

                fetch('http://localhost:8000/topics/'+post.topic)
                .then(res => {
                return res.json()
                })
                .then((topic)=>{
                setTopic(topic);
                })

            })
        }

    },[comment]);


    return (
        <div className="post-page-comment-container">
            <input id={"reply-checkbox-"+comment.id} type="checkbox" className="post-page-comment-reply-checkbox hidden-checkbox"/>        
            <div className="post-page-comment-content-container" ref={SetCommentRef(comment.id)}>
                <div className="post-page-comment-wrapper flex-row">
                    <div className="post-page-comment-avatar">
                    {
                        user &&
                        <Avatar bgImg={user.avatar.bgImg} bgColor={user.avatar.bgColor} baseColor={user.avatar.baseColor} accImg={user.avatar.accImg} accColor={user.avatar.accColor} width={65} />
                    }
                    </div>
                    <div className="post-page-comment-content flex-column">
                        <p className="post-page-comment-info"> <Link className="user-tag" to={"/user/"+comment.user.id}>{comment.user.username}&nbsp; </Link>{CalculateTime()}</p>
                        <p className="post-page-comment-text">{FormatText(comment.text)}</p>
                    </div>
                </div>

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
                        <textarea className="post-page-write-reply-input" placeholder="Write your reply..." minheight={100} value={newReply} onInput={AutoResize} onChange={handleReply}></textarea>
                        <input className="post-page-write-reply-submit" type="submit" value="Reply" />
                        <div className="post-page-comment-replies-line" first="true"></div>
                    </form>
                    <div>
                        {
                            replyList && replyList.map((reply,index)=>
                            <Reply comment={reply} SetCommentRef={SetCommentRef} targetCommentId={targetCommentId} SetReplyRef={SetReplyRef} ScrollToReply={ScrollToReply} currentUser={currentUser} setCurrentUser={setCurrentUser} post={post} topic={topic} setComments={setComments} key={reply.id} last={index===replyList.length-1 ? "true" : "false"} users={users} />
                            )
                        }
                    </div>
                </div>
              
            </div>
        
           
        </div>
    )
}

export default Comment;