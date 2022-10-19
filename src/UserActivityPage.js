import {useState, useEffect} from "react"
import { Link } from "react-router-dom";
import Header from "./Header";
import Post from "./Post";
import './MainPage.css';
import "./UserActivityPage.css"

function UserActivityPage({posts, currentUser, setCurrentUser})
{

    const [currentTab,setCurrentTab] = useState("overview");

    function handleCurrentTab(event)
    {
        setCurrentTab(event.target.name)
    }

    function sortPosts(postList)
    {
        return postList.sort().slice().reverse();
    }

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
              {
                posts && posts.length>0 ? sortPosts(posts).map((post)=>
                  <Post post={post} currentUser={currentUser} setCurrentUser={setCurrentUser} key={"post"+post.id} />
                ) : <div className="blog-empty-label flex-center"><h1>No Posts Available</h1></div>
              }
            </div>
          </div>
        </div>
      );
}

export default UserActivityPage;