import logo from './logo.svg';
import './main-page.css';
import {useState, useEffect} from "react"


function Post({post})
{
  const savedVotes = post.votes;

  const [userVote,setUserVote] = useState("none");
  const [currentVotes,setCurrentVotes] = useState(savedVotes);

  function handleUserVote(newVote)
  {
    if(newVote===userVote)
    {
      setUserVote("none");
    }
    else
    {
      setUserVote(newVote);
    }
  }

  function calculateCurrentVotes()
  {
    return savedVotes + (userVote==="like" ? 1 : userVote==="dislike" ? -1 : 0)
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
            <button className="voting-button" vote={userVote==="like" ? "like" : "none"} onClick={function(){handleUserVote("like")}}>Like</button>
            <p>{calculateCurrentVotes()}</p>
            <button className="voting-button" vote={userVote==="dislike" ? "dislike" : "none"} onClick={function(){handleUserVote("dislike")}}>Dislike</button>
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
