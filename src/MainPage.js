import {useState, useEffect} from "react"
import { Link } from "react-router-dom";
import Header from "./Header";
import Post from "./Post";
import './MainPage.css';

function MainPage({posts})
{

  function sortPosts(postList)
  {
    return postList.reverse()
  }

    return (
        <div className="main-page">
          <Header />
          <div className="page-container flex-center">
            <div className="main-column flex-column">
              <div className="blog-sort-container flex-row">
                <Link className="write-post-button" to="/write">Write a post!</Link>
              </div>
              {
                posts && sortPosts(posts).map((post)=>
                  <Post post={post} key={"post"+post.id} />
                )
              }
            </div>
          </div>
        </div>
      );
}

export default MainPage;