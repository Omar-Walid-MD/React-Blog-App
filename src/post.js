import './MainPage.css';
import {useState, useEffect} from "react";
import axios from 'axios';


function Post({post})
{

  const [voteState,setVoteState] = useState("none");
  
  function handleVote(newVoteState)
  {
    if(newVoteState===voteState)
    {
      setVoteState("none")
    }
    else
    {
      if(newVoteState==="like")
      {
        setVoteState("like");
      }
      else if(newVoteState==="dislike")
      {
        setVoteState("dislike");
      }

      // setLikes(post.likes + (newVoteState==="like" ? 1 : 0));
      // setDislikes(post.dislikes + (newVoteState==="dislike" ? 1 : 0));
    }


  }

  function UpdateVotes()
  {
      let updatedPost = {
        ...post,
        likes: (voteState==="like" ? post.likes+1 : post.likes),
        dislikes: (voteState==="dislike" ? post.dislikes+1 : post.dislikes),
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
    
  }

  useEffect(()=>{

    UpdateVotes();
  },[voteState])

  return(
    <div className="post-container flex-column">
      <div className="post-info">
        <p className="post-date">posted by OmarWalid at {new Date(post.date).toDateString()} {new Date(post.date).toLocaleTimeString()}</p>
        <h1 className="post-title">{post.title}</h1>
        <p className="post-body">{post.body}</p>
      </div>
      <div className="post-bottom-bar flex-row">
        <div className="post-options flex-row">
          <div className="post-votes-container flex-row">
            <button className="voting-button flex-row" vote={voteState==="like" ? "like" : "none"} onClick={function(){handleVote("like")}}><i className='bx bxs-like voting-icon'></i>{(voteState==="like" ? post.likes+1 : post.likes)}</button>
            <button className="voting-button flex-row" vote={voteState==="dislike" ? "dislike" : "none"} onClick={function(){handleVote("dislike")}}><i className='bx bxs-dislike voting-icon' ></i>{(voteState==="dislike" ? post.dislikes+1 : post.dislikes)}</button>
          </div>
          <div>Comments(0)</div>
          <div>Save</div>
        </div>
      </div>

    </div>
  )
}

export default Post;