import {useState, useEffect} from "react"
import { Link } from "react-router-dom";
import Header from "./Header";
import Post from "./Post";
import './MainPage.css';

function MainPage({posts, currentUser, setCurrentUser})
{

    function sortPosts(postList)
    {
      return postList.sort().slice().reverse();
    }

    useEffect(()=>{

      posts && console.log(sortPosts(posts))

    },[posts])

    return (
        <div className="main-page">
          <Header currentUser={currentUser} setCurrentUser={setCurrentUser} />
          <div className="page-container flex-center">
            <div className="main-column flex-column">
              <div className="blog-sort-container flex-row">
                {
                  currentUser && 
                  <Link className="write-post-button" to="/write">Write a post!</Link>
                }
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

export default MainPage;