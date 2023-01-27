import {useState, useEffect, useRef} from "react"
import { Link, useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from 'axios';

import Navbar from "../Main Page/Navbar";
import Comment from "./Comment";
import TopicLogo from "../Main Page/TopicLogo";

import '../Main Page/MainPage.css';
import "./PostPage.css";
import PopUpContainer from "../Main Page/PopUp";

function PostPage({topics, currentUser, setCurrentUser,users})
{
    const [tr,il8n] = useTranslation();

    let postId = useParams().id;

    const location = useLocation();
    const {targetCommentId} = location.state || {};
    const {submittedPost} = location.state || {};

    const targetComment = useRef(null);

    const [post,setPost] = useState(submittedPost==={} ? null : submittedPost);
    const [topic,setTopic] = useState();

    const [voteState,setVoteState] = useState("none");
    const [likes,setLikes] = useState(0);
    const [dislikes,setDislikes] = useState(0);

    const [newComment,setNewComment] = useState("");

    const [comments,setComments] = useState([]);

    const [saved,setSaved] = useState();

    const [buttonLock,setButtonLock] = useState(false);

    const [popUps,setPopUps] = useState([]);

    function addPopUp(text)
    {
        let newPopUp = {
            text: text,
            id: makeId(5),
            active: false
        };
        setPopUps(prev => [...prev,newPopUp]);
    }

    function lockButtons()
    {
        setButtonLock(true);
        setTimeout(() => {
            setButtonLock(false);
        }, 500);
    }

    function handleComment(event)
    {
        setNewComment(event.target.value);
    }

    function submitComment(event)
    {
        event.preventDefault();

        if(currentUser)
        {

            if(newComment!=="")
            {
    
                let commentToAdd = {
                    id: "comment-"+makeId(10),
                    text: newComment,
                    user: {username: currentUser.username,id: currentUser.id},
                    post: postId,
                    date: Date.now(),
                    likes: 0,
                    dislikes: 0,
                    parentComment: "none"
                }
    
                fetch('http://localhost:8000/comments',{
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(commentToAdd)
                }).then(()=>{
                    console.log("New Comment Added.");
                    setNewComment("");
                    setComments(prev => [...prev,commentToAdd]);
                });
    
                if(currentUser.id!==post.user.id)
                {
                    fetch('http://localhost:8000/users/'+post.user.id)
                    .then(res => {
                    return res.json()
                    })
                    .then((targetUser)=>{
    
                        let newNotif = {
                            type: "comment",
                            state: "new",
                            id: makeId(5),
                            user: currentUser.id,
                            comment: commentToAdd.id,
                            post: post.id,
                            topic: topic.id
                        }
        
                        SendNotif(newNotif,targetUser);
                    });
    
                }
    
                if(GetTags(commentToAdd.text))
                {
                    let tags = GetTags(commentToAdd.text);
    
                    let tagNotifs = [];
    
                    for (let i = 0; i < tags.length; i++)
                    {
                        const tag = tags[i];
                        tagNotifs.push(GetUserFromName(tag));
                    }
    
                    for (let i = 0; i < tagNotifs.length; i++)
                    {
                        const targetUser = tagNotifs[i];
                        
                        let newNotif = {
                            type: "comment-tag",
                            state: "new",
                            id: makeId(5),
                            user: currentUser.id,
                            comment: commentToAdd.id,
                            post: post.id,
                            topic: topic.id
                        };
    
                        SendNotif(newNotif,targetUser);
                        
                    }
                }
            }
        }
        else
        {
            addPopUp("Must be logged in to comment!")
            
        }
    }

    function GetTags(commentText)
    {
        let textSplit = commentText.split(' ').filter((word)=> word[0]==='@').map((word)=>word.slice(1,word.length));
        return textSplit.length>0 ? textSplit : null;
    }

    function GetUserFromName(username)
    {
        for (let i = 0; i < users.length; i++)
        {
            const user = users[i];

            if(user.username===username)
            {
                console.log(user);
                return user;
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

    
    function AutoResize(event)
    {
        event.target.style.minHeight = 0;
        event.target.style.minHeight = "max(" + event.target.getAttribute("minheight") + "px,"+(event.target.scrollHeight) + "px)" ;
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
            addPopUp("Must be logged in to vote!")
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
        if(currentUser && post)
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

    function GetMainComments(commentList)
    {
        return commentList.filter((comment)=>comment.post===postId && comment.parentComment==="none").slice().reverse();
    }

    function GetCommentReplies(commentId,commentList)
    {
        return commentList.filter((comment)=>comment.post===postId && comment.parentComment===commentId);
    }

    function SetTargetComment(commentId)
    {
        return targetCommentId===commentId ? targetComment : null;
    }

    function IsTopicSubbed(topicId)
    {
      return currentUser && currentUser.subbedTopics.includes(topicId);
    }

    function SetTopicSubbed(topicId)
    {
        if(currentUser)
        {

            let newSubbedTopics = [];
    
            if(IsTopicSubbed(topicId))
            {
                newSubbedTopics = currentUser.subbedTopics.filter((subbedTopic)=>subbedTopic!==topicId);
            }
            else
            {
                newSubbedTopics = [...currentUser.subbedTopics,topicId];
            }
    
            let updatedUser = {
                ...currentUser,
                subbedTopics: newSubbedTopics
            }
            
            axios.put('http://localhost:8000/users/'+updatedUser.id,
                updatedUser
            )
            .then(resp =>{
                console.log("Updated User Subs");
                localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                setCurrentUser(updatedUser);
            }).catch(error => {
                console.log(error);
            });
    
            let updatedTopic = {
                ...topic,
                members: topic.members + (newSubbedTopics.includes(topic.id) ? 1 : -1)
            }
    
            axios.put('http://localhost:8000/topics/'+topic.id,
                updatedTopic
            )
            .then(resp =>{
                setTopic(updatedTopic);
            }).catch(error => {
                console.log(error);
            });
        }
    }

    function ScrollToComment()
    {
        if(targetComment.current.getAttribute("reply")==="true")
        {
            document.querySelector("#"+targetComment.current.getAttribute("parentcommentid")).previousSibling.checked=true
        }
        targetComment.current.scrollIntoView({
            behavior: 'auto',
            block: 'center',
            inline: 'center'
        });
    }

    function FormatText(postText)
    {
        let postTextSplit = postText.split(' ').map((word)=> word[0]==='@' ? <Link to={"/user/" + GetUserFromName(word.slice(1,word.length)).id} className="user-tag">{word}&nbsp;</Link> : word+" ");
        return postTextSplit;
    }

    function GetUserFromName(username)
    {
        if(users)
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
        }
        else
        {
            return {id: "undefined"};
        }
    }

    function CalculateTime()
    {
        let timeDifference =  new Date() - new Date(post.date);

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

        window.scrollTo(0,0);    
        if(!post)
        {
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
        }
        

    },[postId]);

    useEffect(()=>{
        if(post) 
        {
            if(currentUser)
            {
                setVoteState(CheckUserVote());
                setSaved(currentUser.savedPosts.includes(post.id));
            }

            fetch('http://localhost:8000/topics/'+post.topic)
            .then(res => {
            return res.json()
            })
            .then((data)=>{
        
                setTopic(data);
            });
        }

    },[post, currentUser])


    useEffect(()=>{
        if(targetComment.current) ScrollToComment();
    },[targetComment.current]);

    useEffect(()=>{
        console.log(popUps);
    },[popUps])

    return (
        <div className="main-page">
            <Navbar topics={topics} currentUser={currentUser} setCurrentUser={setCurrentUser} />
            <div className="page-container flex-center">
            {
                post &&
                <div className="post-page-main-column main-column flex-column">
    
                        <div className="post-page-post-container flex-column">
                            <div className="post-info">
                               
                                <p className="post-page-post-date">{tr("post.postedBy")} <Link className="user-tag" to={"/user/"+post.user.id}>{post.user.username}</Link> {CalculateTime()}</p>
                                <h1 className="post-page-post-title">{post.title}</h1>
                                <p className="post-page-post-body">{FormatText(post.body)}</p>
                            </div>        
                        </div>
                        <div className="post-page-bottom-bar post-bottom-bar flex-row">
                            <div className="post-options flex-row">
                                <div className="votes-container flex-row">
                                    <button className="voting-button flex-row" vote={voteState==="like" ? "like" : "none"} onClick={function(){if(!buttonLock){handleVote("like"); lockButtons();}}}><i className='bx bxs-like voting-icon'></i>{(likes)}</button>
                                    <button className="voting-button flex-row" vote={voteState==="dislike" ? "dislike" : "none"} onClick={function(){if(!buttonLock){handleVote("dislike"); lockButtons();}}}><i className='bx bxs-dislike voting-icon' ></i>{(dislikes)}</button>
                                </div>
                                {
                                    currentUser &&
                                    <button className="save-button flex-row" saved={saved ? "true" : "false"} onClick={function(){if(!buttonLock){handleSave(); lockButtons();}}} ><i className='bx bxs-save voting-icon'></i>{saved ? tr("post.saved") : tr("post.save")}</button>
                                }                            
                                </div>
                        </div>
                        <div className="post-page-comments-section-container">
                            {
                                // currentUser ?
                                <form className="post-page-write-comment-form flex-column" onSubmit={(event)=>{event.preventDefault();if(!buttonLock){submitComment(event);lockButtons();}}}>
                                    <textarea className="post-page-write-comment-input" placeholder={tr("post.writeComment")} minheight={100} value={newComment} onChange={handleComment} onInput={AutoResize}></textarea>
                                    <input className="button post-page-write-comment-submit" type="submit" value={tr("post.comment")} />
                                </form>
                                // :
                                // <div className="post-page-logged-out-warning" type="comment">
                                //     {tr("mustBeLoggedInToComment")}
                                // </div>
                            }
                            <div className="post-page-comments-section">
                                {
                                    comments && GetMainComments(comments).length > 0 ? GetMainComments(comments).map((comment)=>
                                    <Comment comment={comment} key={comment.id} SetCommentRef={SetTargetComment} targetCommentId={targetCommentId} currentUser={currentUser} setCurrentUser={setCurrentUser} setComments={setComments} replyList={GetCommentReplies(comment.id,comments)} users={users} addPopUp={addPopUp} />
                                    )
                                    : <h1 className="post-page-comments-section-empty-label">{tr("noComments")}</h1>
                                }
                            </div>
                        </div>
                    
                </div>
            }

            {
             topic &&
              <div className="post-page-side-column side-column">
                <div className="side-column-container flex-column">
                  <div className="side-column-topic-overview flex-column">
                    <TopicLogo topicLogo={topic.logo}/>
                    <div>
                      <h1 className="side-column-topic-title">{topic.title}</h1>
                      <p className="side-column-topic-desc">{topic.description}</p>
                    </div>
                  </div>
                  <div className="side-column-topic-info">
                    <div className="side-column-topic-status flex-row">
                      <p className="side-column-topic-members">{topic.members} {tr("mainPage.members")}</p>
                      <button className="button side-column-topic-sub-button" subbed={IsTopicSubbed(topic.id) ? "true" : "false"} onClick={function(){if(!buttonLock){SetTopicSubbed(topic.id); lockButtons();}}}>{IsTopicSubbed(topic.id) ? tr("mainPage.unsub") : tr("mainPage.sub")}</button>
                    </div>
                    <p className="side-column-topic-date">{tr("mainPage.createdOn")} {new Date(topic.date).toDateString()}</p>
                  </div>
                </div>
              </div>
            }
          </div>
            <PopUpContainer popUps={popUps} setPopUps={setPopUps} />
        </div>
      );
}

export default PostPage;