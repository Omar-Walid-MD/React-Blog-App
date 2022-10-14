import logo from './logo.svg';
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
        <p className="post-date">posted by OmarWalid 25 minutes ago</p>
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

function App()
{

  const [posts,setPosts] = useState();

  useEffect(()=>{

    fetch('http://localhost:8000/posts')
    .then(res => {
      return res.json()
    })
    .then((data)=>{
    //   console.log(data);
    setPosts(data);
    console.log(data);
    })

  },[])

  return (
    <div className="main-page">
      <header className="navbar flex-row">
        <div>
          <h1 className="navbar-logo">BLOG APP</h1>
        </div>
        <div className="navbar-options flex-row">
          <p>LINK</p>
          <p>LINK</p>
        </div>
      </header>
      <div className="page-container flex-center">
        <div className="main-column flex-column">
          <div className="blog-sort-container">

          </div>
          {
            posts && posts.map((post)=>
              <Post post={post} key={"post"+post.id} />
            )
          }
        </div>
      </div>
    </div>
  );
}

export default App;
