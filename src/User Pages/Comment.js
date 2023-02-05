import {useState, useEffect, useRef} from "react"
import { Link, useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from 'axios';

function Comment({posts, comment, currentUser, setCurrentUser})
{
  const [tr,il8n] = useTranslation();

  const linkPost = (posts.filter((post)=>post.id===comment.post)[0]);

  const [user,setUser] = useState();

  const [voteState,setVoteState] = useState(CheckUserVote());
  const [likes,setLikes] = useState(comment.likes);
  const [dislikes,setDislikes] = useState(comment.dislikes);

  const [saved,setSaved] = useState(currentUser && currentUser.savedPosts.includes(comment.id));

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

  useEffect(()=>{

    if(!user)
    {
        fetch('http://localhost:8000/users/'+comment.user.id)
        .then(res => {
        return res.json()
        })
        .then((data)=>{
        setUser(data);
        })
    }

},[comment]);

  return (
    <div className="activity-page-comment-container">
      <div className="activity-page-comment-link-padding">
        <Link to={"/post/"+linkPost.id} state={{targetCommentId: comment.id}} className="activity-page-comment-link">
          <p className="activity-page-comment-info">{tr("userPages.by")} <Link className="user-tag" to={"/user/"+comment.user.id}>{user && user.username}</Link> {CalculateTime()}</p>
          <p className="activity-page-comment-post">{tr("userPages.on")} "{linkPost.title}"</p>
          <p className="activity-page-comment-text">{comment.text}</p>
        </Link>
      </div>
      <div className="activity-page-comment-bottom-bar comment-bottom-bar flex-row">
        <div className="comment-options flex-row">
        <div className="votes-container flex-row">
          <button className="voting-button flex-row" vote={voteState==="like" ? "like" : "none"} onClick={function(){if(!buttonLock){handleVote("like"); lockButtons();}}} ><i className='bx bxs-like voting-icon'></i>{(likes)}</button>
          <button className="voting-button flex-row" vote={voteState==="dislike" ? "dislike" : "none"} onClick={function(){if(!buttonLock){handleVote("dislike"); lockButtons();}}} ><i className='bx bxs-dislike voting-icon' ></i>{(dislikes)}</button>
        </div>
        <Link to={"/post/"+linkPost.id} state={{targetCommentId: comment.id}} className="comment-reply-button flex-row"><i className='bx bxs-comment-detail comment-icon'></i>{tr("comment.reply")}</Link>
        {
            currentUser &&
            <button className="save-button flex-row" saved={saved ? "true" : "false"} onClick={function(){if(!buttonLock){handleSave(); lockButtons();}}} ><i className='bx bxs-save voting-icon'></i>{saved ? tr("post.saved") : tr("post.save")}</button>
        }
        </div>
      </div> 
    </div>
  )
}

export default Comment;