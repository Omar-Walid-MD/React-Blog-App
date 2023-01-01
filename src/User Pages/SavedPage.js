import {useState, useEffect, useRef} from "react"
import { Link, useParams, useLocation } from "react-router-dom";
import axios from 'axios';

import Header from "../Main Page/Header";
import Post from "./Post";
import Comment from "../Post Page/Comment";

import "../Post Page/PostPage.css"
import '../Main Page/MainPage.css';
import "./UserActivityPage.css"


function UserComment({posts, comment, currentUser, setCurrentUser})
{
  const linkPost = (posts.filter((post)=>post.id===comment.post)[0]);

  const [voteState,setVoteState] = useState(CheckUserVote());
  const [likes,setLikes] = useState(comment.likes);
  const [dislikes,setDislikes] = useState(comment.dislikes);

  const [saved,setSaved] = useState(currentUser.savedPosts.includes(comment.id));

  const [buttonLock,setButtonLock] = useState(false);

  function lockButtons()
  {
      setButtonLock(true);
      setTimeout(() => {
          setButtonLock(false);
      }, 100);
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

  return (
    <div className="activity-page-comment-container">
      <div className="activity-page-comment-link-padding">
        <Link to={"/post/"+linkPost.id} state={{targetCommentId: comment.id}} className="activity-page-comment-link">
          <p className="activity-page-comment-info">By {comment.user} at {new Date(comment.date).toDateString()} {new Date(comment.date).toLocaleTimeString()} </p>
          <p className="activity-page-comment-post">On "{linkPost.title}"</p>
          <p className="activity-page-comment-text">{comment.text}</p>
        </Link>
      </div>
      <div className="activity-page-comment-bottom-bar flex-row">
        <div className="comment-options flex-row">
        <div className="comment-votes-container flex-row">
          <button className="comment-voting-button flex-row" vote={voteState==="like" ? "like" : "none"} onClick={function(){if(!buttonLock){handleVote("like"); lockButtons();}}} ><i className='bx bxs-like voting-icon'></i>{(likes)}</button>
          <button className="comment-voting-button flex-row" vote={voteState==="dislike" ? "dislike" : "none"} onClick={function(){if(!buttonLock){handleVote("dislike"); lockButtons();}}} ><i className='bx bxs-dislike voting-icon' ></i>{(dislikes)}</button>
        </div>
        <Link to={"/post/"+linkPost.id} state={{targetCommentId: comment.id}} className="comment-reply-button flex-row"><i className='bx bxs-comment-detail comment-icon'></i>Reply</Link>
        <button className="comment-save-button flex-row" saved={saved ? "true" : "false"} onClick={function(){if(!buttonLock){handleSave(); lockButtons();}}} ><i className='bx bxs-save voting-icon'></i>{saved ? "Saved" : "Save"}</button>
        </div>
      </div> 
    </div>
  )
}


function SavedPage({posts, topics, currentUser, setCurrentUser})
{

    const [currentTab,setCurrentTab] = useState("overview");

    const [comments,setComments] = useState();

    function handleCurrentTab(event)
    {
        setCurrentTab(event.target.name)
    }

    function GetContent(currentTab)
    {
      let contents = null;
      
      if(currentTab==="overview")
      {
        contents = [...posts.map((post)=>({...post,type: "post"})),...comments.map((comment)=>({...comment,type: "comment"}))];
      }
      else if(currentTab==="posts")
      {
        contents = posts.map((post)=>({...post,type: "post"}));
      }
      else if(currentTab==="comments")
      {
        contents = comments.map((comment)=>({...comment,type: "comment"}));
      }

      console.log(currentUser.savedPosts);
      return contents.filter((content)=>currentUser.savedPosts.includes(content.id));
    }

    function SortContent(contents)
    {
        return contents.sort().slice().reverse();
    }

    useEffect(()=>{

      fetch('http://localhost:8000/comments')
      .then(res => {
        return res.json()
      })
      .then((data)=>{
      //   console.log(data);
      setComments(data);
      })
  
    },[posts]);

    return (
        <div className="main-page">
        <Header topics={topics} currentUser={currentUser} setCurrentUser={setCurrentUser} />
          <div className="page-container flex-center">
            <div className="main-column flex-column">
              <div className="activity-page-option-row flex-row">
                <button className="activity-page-option-button" name="overview" current={currentTab === "overview" ? "true" : "false"} onClick={handleCurrentTab} >Overview</button>
                <button className="activity-page-option-button" name="posts" current={currentTab === "posts" ? "true" : "false"} onClick={handleCurrentTab} >Posts</button>
                <button className="activity-page-option-button" name="comments" current={currentTab === "comments" ? "true" : "false"} onClick={handleCurrentTab} >Comments</button>
              </div>
              <div className="activity-page-content-container">
              {
                comments && posts ? SortContent(GetContent(currentTab)).length > 0 ? SortContent(GetContent(currentTab)).map((content)=>
                  content.type==="post" ? <Post post={content} key={content.id} currentUser={currentUser} setCurrentUser={setCurrentUser} /> : content.type==="comment" && <UserComment comment={content} posts={posts} key={content.id} currentUser={currentUser} setCurrentUser={setCurrentUser}/>)
                 : <div className="blog-empty-label flex-center"><h1>No Content Available</h1></div>
                 : <div className="blog-empty-label flex-center"><img src={require("../img/loading.png")} /></div>
              }
              </div>
            </div>
          </div>
        </div>
      );
}

export default SavedPage;