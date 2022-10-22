import {useState, useEffect} from "react"
import { Link, useParams } from "react-router-dom";

import Header from "./Header";
import Post from "./Post";

import './MainPage.css';

function MainPage({posts, topics, currentUser, setCurrentUser})
{
    let topicId = useParams().id;

    function GetPostsForTopic(topicId)
    {
      return topicId ? posts.filter((post)=>post.topic===topicId) : posts.filter((post)=>currentUser.subbedTopics.includes(post.topic));
    }

    function sortPosts(postList)
    {
      return postList.sort().slice().reverse();
    }

    // useEffect(()=>{

    //   fetch('http://localhost:8000/topcs/'+topicId)
    //     .then(res => {
    //     return res.json()
    //     })
    //     .then((data)=>{

    //         setPost(data);
    //         setVoteState(CheckUserVote(data));
    //         setLikes(data.likes);
    //         setDislikes(data.dislikes);
    //     });

    // },[topicId])


    return (
        <div className="main-page">
          <Header topics={topics} currentUser={currentUser} setCurrentUser={setCurrentUser} />
          <div className="page-container flex-center">
            <div className="main-column flex-column">
              <div className="blog-sort-container flex-row">
                {
                  currentUser && 
                  <Link className="write-post-button" to="/write">Write a post!</Link>
                }
              </div>
              {
                posts && GetPostsForTopic(topicId).length>0 ? sortPosts(GetPostsForTopic(topicId)).map((post)=>
                  <Post post={post} currentUser={currentUser} setCurrentUser={setCurrentUser} key={"post"+post.id} />
                ) : <div className="blog-empty-label flex-center"><h1>No Posts Available</h1></div>
              }
            </div>
          </div>
        </div>
      );
}

export default MainPage;