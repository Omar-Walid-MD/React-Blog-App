import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import axios from 'axios';

import TopicLogo from "../Main Page/TopicLogo";

import '../Main Page/MainPage.css';

function Post({post,currentUser,setCurrentUser})
{

  const [voteState,setVoteState] = useState(CheckUserVote());
  const [likes,setLikes] = useState(post.likes);
  const [dislikes,setDislikes] = useState(post.dislikes);

  const [commentsCount,setCommentsCount] = useState(0);
  const [topic,setTopic] = useState();

  const [saved,setSaved] = useState();
  
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


  function GetPostLength()
  {
    return (post.body.length > 800);
  }



  useEffect(()=>{

    fetch('http://localhost:8000/comments/')
    .then(res => {
    return res.json()
    })
    .then((data)=>{

        setCommentsCount(data.filter((comment)=>comment.post===post.id).length);
    });
    
    currentUser && setSaved(currentUser.savedPosts.includes(post.id));

  },[currentUser])

  useEffect(()=>{

    fetch('http://localhost:8000/topics/'+post.topic)
    .then(res => {
    return res.json()
    })
    .then((data)=>{

        setTopic(data);
    });
  },[post]);

  return(     
    <div className="post-container flex-column">
      <Link to={"/post/"+post.id} className="post-info">
        <div className="post-info-top-row flex-row">
          {
            topic &&
            <div className="flex-row">
              <Link to={"/topic/"+topic.id}>
                <TopicLogo bgImg={topic.logo.bgImg} bgColor={topic.logo.bgColor} fgImg={topic.logo.fgImg} fgColor={topic.logo.fgColor} width={60} />
              </Link>
              <p className="post-topic-title">{topic.title}</p>
            </div>
          }
          <p className="post-date">posted by {post.user} at {new Date(post.date).toDateString()} {new Date(post.date).toLocaleTimeString()}</p>
        </div>
        <h1 className="post-title">{post.title}</h1>
        <p className="post-body">{post.body}</p>
        {
          GetPostLength() && <div className="post-long-shadow"></div>
        }
      </Link>
      <div className="post-bottom-bar flex-row">
        <div className="post-options flex-row">
          <div className="post-votes-container flex-row">
            <button className="voting-button flex-row" vote={voteState==="like" ? "like" : "none"} onClick={function(){handleVote("like")}}><i className='bx bxs-like voting-icon'></i>{(likes)}</button>
            <button className="voting-button flex-row" vote={voteState==="dislike" ? "dislike" : "none"} onClick={function(){handleVote("dislike")}}><i className='bx bxs-dislike voting-icon' ></i>{(dislikes)}</button>
          </div>
          <Link to={"/post/"+post.id} className="comment-button flex-row"><i className='bx bxs-comment-detail comment-icon'></i>({commentsCount})</Link>
          <button className="save-button flex-row" saved={saved ? "true" : "false"}  onClick={handleSave}><i className='bx bxs-save voting-icon'></i>{saved ? "Saved" : "Save"}</button>
        </div>
      </div>

    </div>
      
  )
}

export default Post;