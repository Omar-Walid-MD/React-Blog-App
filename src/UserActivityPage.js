import {useState, useEffect} from "react"
import { Link } from "react-router-dom";
import Header from "./Header";
import Post from "./Post";
import Comment from "./Comment";
import './MainPage.css';
import "./UserActivityPage.css"

function UserActivityPage({posts, currentUser, setCurrentUser})
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

      return contents.filter((content)=>content.user===currentUser.username);
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
          <Header currentUser={currentUser} setCurrentUser={setCurrentUser} />
          <div className="page-container flex-center">
            <div className="main-column flex-column">
              <div className="activity-page-option-row flex-row">
                <button className="activity-page-option-button" name="overview" current={currentTab === "overview" ? "true" : "false"} onClick={handleCurrentTab} >Overview</button>
                <button className="activity-page-option-button" name="posts" current={currentTab === "posts" ? "true" : "false"} onClick={handleCurrentTab} >Posts</button>
                <button className="activity-page-option-button" name="comments" current={currentTab === "comments" ? "true" : "false"} onClick={handleCurrentTab} >Comments</button>
              </div>
              <div className="activity-page-content-container">
              {
                posts && SortContent(GetContent(currentTab)).map((content)=>
                 
                   content.type==="post" ? <Post post={content} key={content.id} /> : content.type==="comment" && <Comment comment={content} key={content.id}/>
                 
                 )
              }
              </div>
            </div>
          </div>
        </div>
      );
}

export default UserActivityPage;