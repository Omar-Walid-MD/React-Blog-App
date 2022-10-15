import './main-page.css';
import {useState, useEffect} from "react"

function Post({post})
{

  const [likes,setLikes] = useState(post.likes);
  const [dislikes,setDislikes] = useState(post.dislikes);
  const [voteState,setVoteState] = useState("none");
  
  function handleVote(newVoteState)
  {
    if(newVoteState===voteState)
    {
      setVoteState("none")

      setLikes(post.likes);
      setDislikes(post.dislikes);
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

      setLikes(post.likes + (newVoteState==="like" ? 1 : 0));
      setDislikes(post.dislikes + (newVoteState==="dislike" ? 1 : 0));
    }

  }

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
            <button className="voting-button flex-row" vote={voteState==="like" && "like"} onClick={function(){handleVote("like")}}><i className='bx bxs-like voting-icon'></i>{likes}</button>
            <button className="voting-button flex-row" vote={voteState==="dislike" && "dislike"} onClick={function(){handleVote("dislike")}}><i className='bx bxs-dislike voting-icon' ></i>{dislikes}</button>
          </div>
          <div>Comments(0)</div>
          <div>Save</div>
        </div>
      </div>

    </div>
  )
}

export default Post;