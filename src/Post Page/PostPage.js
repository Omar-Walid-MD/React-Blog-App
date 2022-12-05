import {useState, useEffect, useRef} from "react"
import { Link, useParams, useLocation } from "react-router-dom";
import axios from 'axios';

import Header from "../Main Page/Header";
import Comment from "../User Pages/Comment";
import TopicLogo from "../Main Page/TopicLogo";

import '../Main Page/MainPage.css';
import "./PostPage.css";

function PostPage({topics, currentUser, setCurrentUser,users})
{

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
                        type: "tag",
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

            console.log(username);
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
        return commentList.filter((comment)=>comment.post===postId && comment.parentComment==="none").reverse();
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
      return currentUser.subbedTopics.includes(topicId);
    }

    function SetTopicSubbed(topicId)
    {

      let newSubbedTopics = [];

      if(IsTopicSubbed(topicId))
      {
        newSubbedTopics = currentUser.subbedTopics.filter((subbedTopic)=>subbedTopic!==topicId);
        console.log(currentUser.subbedTopics.filter((subbedTopic)=>subbedTopic!==topicId));
      }
      else
      {
        newSubbedTopics = [...currentUser.subbedTopics,topicId];
        console.log("uh oh");
      }

      let updatedUser = {
        ...currentUser,
        subbedTopics: newSubbedTopics
      }
    }

    function ScrollToComment()
    {
        console.log(targetComment.current.getAttribute("reply"))
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
        if(post && currentUser) 
        {
            setVoteState(CheckUserVote());
            setSaved(currentUser.savedPosts.includes(post.id));
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

    return (
        <div className="main-page">
        <Header topics={topics} currentUser={currentUser} setCurrentUser={setCurrentUser} />
          <div className="page-container flex-center">
            {
                post &&
                <div className="post-page-main-column flex-column">
    
                        <div className="post-page-post-container flex-column">
                            <div className="post-info">
                                {
                                // topic &&
                                // <Link to={"/topic/"+topic.id} className="post-topic-logo-background flex-center" style={{backgroundImage: 'url(' + require("./img/topic-logo/bg" + topic.logo.bgImg + ".png") + ')', backgroundColor: topic.logo.bgColor}}>
                                //     <div className="topic-logo-foreground-shadow" style={{backgroundImage: 'url(' + require("./img/topic-logo/fg" + topic.logo.fgImg + ".png") + ')'}}></div>
                                //     <div className="topic-logo-foreground" style={{maskImage: 'url(' + require("./img/topic-logo/fg" + topic.logo.fgImg + ".png") + ')', WebkitMaskImage: 'url(' + require("./img/topic-logo/fg" + topic.logo.fgImg + ".png") + ')', backgroundColor: topic.logo.fgColor}}></div>
                                // </Link>
                                }
                                <p className="post-page-post-date">posted by <Link className="user-tag" to={"/user/"+post.user.id}>{post.user.username}</Link> {CalculateTime()}</p>
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
                                    <textarea className="post-page-write-comment-input" placeholder="Write your comment..." minheight={100} value={newComment} onChange={handleComment} onInput={AutoResize}></textarea>
                                    <input className="post-page-write-comment-submit" type="submit" value="Comment" />
                                </form>
                                :
                                <div className="post-page-comment-logged-out-warning">
                                    You must be logged in to comment!
                                </div>
                            }
                            <div className="post-page-comments-section">
                                {
                                    comments && GetMainComments(comments).length > 0 ? GetMainComments(comments).map((comment)=>
                                    <Comment comment={comment} key={comment.id} SetCommentRef={SetTargetComment} currentUser={currentUser} setCurrentUser={setCurrentUser} setComments={setComments} replyList={GetCommentReplies(comment.id,comments)} users={users} />
                                    )
                                    : <h1 className="post-page-comments-section-empty-label">No comments yet</h1>
                                }
                            </div>
                        </div>
                    
                </div>

                
            }

            {
             topic &&
             <div className="post-page-side-column">
                <div className="side-column-container">
                    <div className="side-column-topic-overview">
                    <TopicLogo topicLogo={topic.logo} width={150} />
                    <h1 className="side-column-topic-title">{topic.title}</h1>
                    <p className="side-column-topic-desc">{topic.description}</p>
                    </div>
                    <div className="side-column-topic-status flex-row">
                    <p className="side-column-topic-members">{topic.members} members</p>
                    <button className="side-column-topic-sub-button" subbed={IsTopicSubbed(topic.id) ? "true" : "false"} onClick={function(){SetTopicSubbed(topic.id)}}>{IsTopicSubbed(topic.id) ? "Unsubscribe" : "Subscribe"}</button>
                    </div>
                    <p className="side-column-topic-date">Created on {new Date(topic.date).toDateString()}</p>
                </div>
             </div>
            }
          </div>
        </div>
      );
}

export default PostPage;