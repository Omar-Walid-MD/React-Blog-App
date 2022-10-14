import {useState, useEffect} from "react"
import { Link } from "react-router-dom";
import Post from "./post";
import './main-page.css';

function MainPage({posts})
{
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
              <div className="blog-sort-container flex-row">
                <Link className="write-post-button" to="/write">Write a post!</Link>
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

export default MainPage;