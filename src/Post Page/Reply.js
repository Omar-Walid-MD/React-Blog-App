import {useState, useEffect, useRef} from "react"
import { Link, useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import axios from 'axios';

import Avatar from "../Main Page/Avatar";

import "../Post Page/PostPage.css"

function Reply({comment, targetReply, setTargetReplyId, SetReplyRef, ScrollToReply, currentUser, setCurrentUser, last, post, topic, setComments, users})
{
    const [tr,il8n] = useTranslation();

    const [user,setUser] = useState();

    const [newReply,setNewReply] = useState();

    const [voteState,setVoteState] = useState(CheckUserVote());
    const [likes,setLikes] = useState(comment.likes);
    const [dislikes,setDislikes] = useState(comment.dislikes);

    const [saved,setSaved] = useState(currentUser && currentUser.savedPosts.includes(comment.id));

    const replyInput = useRef();

    const [buttonLock,setButtonLock] = useState(false);

    function lockButtons()
    {
        setButtonLock(true);
        setTimeout(() => {
            setButtonLock(false);
        }, 100);
    }

    function handleReply(event)
    {
        setNewReply(event.target.value);
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
        
            let updatedComment = {
                ...comment,
                likes: newLikes,
                dislikes: newDislikes,
            }
                
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
                parentComment: comment.parentComment
            }

            fetch('http://localhost:8000/comments',{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(replyToAdd)
            }).then(()=>{
                console.log("New Reply Added.");
                setNewReply("");
                setComments(prev => [...prev,replyToAdd]);

                setTargetReplyId(replyToAdd.id);
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
                        state: "new",
                        id: makeId(5),
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

    function MentionReply(userMention)
    {
        replyInput.current.scrollIntoView({
            behavior: 'auto',
            block: 'center',
            inline: 'center'
        });
        
        setNewReply(comment.user.id!==currentUser.id ? "@"+userMention+" " : "");

        replyInput.current.focus();

    }

    function AutoResize(event)
    {
        event.target.style.minHeight = 0;
        event.target.style.minHeight = "max(" + event.target.getAttribute("minheight") + "px,"+(event.target.scrollHeight) + "px)" ;
    }

    function FormatText(replyText)
    {
        let replyTextSplit = replyText.split(' ').map((word)=> word[0]==='@' ? <Link to={"/user/" + GetUserFromName(word.slice(1,word.length)).id} className="user-tag">{word}&nbsp;</Link> : word+" ");
        return replyTextSplit;
    }

    function GetUserFromName(username)
    {
        if(users)
        {
            for (let i = 0; i < users.length; i++)
            {
                const user = users[i];
    
                
                if(user.username===username)
                {
                    return user;
                }
                
            }
        }
        else
        {
            return {id: "undefined"};
        }
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
            fetch('http://localhost:8000/users/'+comment.user.id)
            .then(res => {
            return res.json()
            })
            .then((data)=>{
            setUser(data);
            // console.log(data);
            })
        }

        

    },[comment]);

    useEffect(()=>{
        if(targetReply.current)
        {
            ScrollToReply();
        }
    },[])



    return (
        <div className="post-page-reply-container">
            <div className="post-page-comment-content-container" id={comment.id} ref={SetReplyRef(comment.id)}>
                <div className="post-page-comment-wrapper flex-row">
                    <div className="post-page-comment-avatar">
                    {
                        user &&
                        <Avatar bgImg={user.avatar.bgImg} bgColor={user.avatar.bgColor} baseColor={user.avatar.baseColor} accImg={user.avatar.accImg} accColor={user.avatar.accColor} width={65} />
                    }
                    </div>
                    <div className="post-page-comment-content flex-column">
                        <p className="post-page-comment-info"> <Link className="user-tag" to={"/user/"+comment.user.id}>{user && user.username}&nbsp; </Link>{CalculateTime()}</p>
                        <p className="post-page-comment-text">{FormatText(comment.text)}</p>
                    </div>
                </div>

                <div className="comment-bottom-bar bottom-bar flex-row">
                    <div className="options flex-row">
                    <div className="votes-container flex-row">
                        <button className="voting-button flex-row" vote={voteState==="like" ? "like" : "none"} onClick={function(){if(!buttonLock){handleVote("like"); lockButtons();}}} ><i className='bx bxs-like voting-icon'></i>{(likes)}</button>
                        <button className="voting-button flex-row" vote={voteState==="dislike" ? "dislike" : "none"} onClick={function(){if(!buttonLock){handleVote("dislike"); lockButtons();}}} ><i className='bx bxs-dislike voting-icon' ></i>{(dislikes)}</button>
                    </div>
                    {
                        currentUser &&
                        <label htmlFor={"post-page-reply-checkbox-"+comment.id} className="comment-reply-button flex-row" onClick={function(){MentionReply(user.username)}}><i className='bx bxs-comment-detail comment-icon'></i>{tr("comment.reply")}</label>
                    }
                    {
                        currentUser &&
                        <button className="save-button flex-row" saved={saved ? "true" : "false"} onClick={function(){if(!buttonLock){handleSave(); lockButtons();}}} ><i className='bx bxs-save voting-icon'></i>{saved ? tr("post.saved") : tr("post.save")}</button>
                    }
                    </div>
                </div>


                <div className="reply-pointer-line"></div>
                <div className="post-page-comment-replies-line" replyopen="true" last={last}></div>
            </div>

            <input type="checkbox" className="post-page-reply-checkbox hidden-checkbox" id={"post-page-reply-checkbox-"+comment.id} />
            <form className="post-page-write-reply-form flex-row" onSubmit={submitReply}>
                <textarea className="post-page-write-reply-input" placeholder={tr("comment.writeReply")} ref={replyInput} minheight={100} value={newReply} onInput={AutoResize} onChange={handleReply}></textarea>
                <div className="post-page-write-reply-buttons flex-column">

                    <input className="post-page-write-reply-submit" type="submit" value={tr("comment.reply")} />
                    <label htmlFor={"post-page-reply-checkbox-"+comment.id} className="post-page-write-reply-submit">{tr("comment.cancel")}</label>
                </div>
            </form>
            
        </div>
           
    )
}

export default Reply;