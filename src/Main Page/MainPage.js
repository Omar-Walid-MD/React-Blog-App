import {useState, useEffect} from "react"
import { Link, useParams } from "react-router-dom";
import axios from 'axios';

import Header from "../Main Page/Header";
import Post from "../User Pages/Post";
import TopicLogo from "./TopicLogo";

import './MainPage.css';
import "../Submit Pages/WritePage.css";

function MainPage({posts, topics, currentUser, setCurrentUser})
{
    let topicId = useParams().id;

    const [topic,setTopic] = useState(null);

    function GetPostsForTopic(topic)
    {
      console.log(posts);
      if(currentUser.subbedTopics)
      {
        return topic ? posts.filter((post)=>post.topic===topic.id) : posts.filter((post)=>currentUser.subbedTopics.includes(post.topic));
      }
      else
      {
        return [];
      }
    }

    function sortPosts(postList)
    {
      return postList.sort().slice().reverse();
    }

    function IsTopicSubbed(topicId)
    {
      return currentUser.subbedTopics.includes(topicId);
    }

    function SetTopicSubbed(topicId)
    {

      let newSubbedTopics = [];

      if(IsTopicSubbed(topicId))
      {
        newSubbedTopics = currentUser.subbedTopics.filter((subbedTopic)=>subbedTopic!==topicId);
        console.log(currentUser.subbedTopics.filter((subbedTopic)=>subbedTopic!==topicId));
      }
      else
      {
        newSubbedTopics = [...currentUser.subbedTopics,topicId];
        console.log("uh oh");
      }

      let updatedUser = {
        ...currentUser,
        subbedTopics: newSubbedTopics
      }
      
      // console.log(updatedUser.subbedTopics)

      axios.put('http://localhost:8000/users/'+updatedUser.id,
        updatedUser
      )
      .then(resp =>{
          console.log("Updated User Subs");
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          setCurrentUser(updatedUser);
      }).catch(error => {
          console.log(error);
      });
    }

    useEffect(()=>{

      window.scrollTo(0,0);
      
      if(topicId)
      {
        fetch('http://localhost:8000/topics/'+topicId)
        .then(res => {
        return res.json()
        })
        .then((data)=>{
          
            setTopic(data);
        });      

      }
      else
      {
        setTopic(null);
      }

  },[topicId]);


    return (
        <div className="main-page">
          <Header topics={topics} currentUser={currentUser} setCurrentUser={setCurrentUser} />
          <div className="page-container flex-center">
            <div className="main-column flex-column">
              <div className="blog-sort-container flex-row">
                {
                  currentUser && 
                  <Link className="write-post-button" to={"/write"} state={{topicForPost: topicId}}>Write a post!</Link>
                }
              </div>
              <div className="main-column-post-group">
              {
                currentUser && posts && GetPostsForTopic(topic).length>0 ? sortPosts(GetPostsForTopic(topic)).map((post)=>
                  <Post post={post} currentUser={currentUser} setCurrentUser={setCurrentUser} key={"post"+post.id} />
                ) : <div className="blog-empty-label flex-center"><h1>No Posts Available</h1></div>
              }
              </div>
            </div>
            {
             topic &&
              <div className="side-column">
                <div className="side-column-container">
                  <div className="side-column-topic-overview">
                    <TopicLogo bgImg={topic.logo.bgImg} bgColor={topic.logo.bgColor} fgImg={topic.logo.fgImg} fgColor={topic.logo.fgColor} width={150} />
                    <h1 className="side-column-topic-title">{topic.title}</h1>
                    <p className="side-column-topic-desc">{topic.description}</p>
                  </div>
                  <div className="side-column-topic-status flex-row">
                    <p className="side-column-topic-members">{topic.members} members</p>
                    <button className="side-column-topic-sub-button" subbed={IsTopicSubbed(topicId) ? "true" : "false"} onClick={function(){SetTopicSubbed(topicId)}}>{IsTopicSubbed(topicId) ? "Unsubscribe" : "Subscribe"}</button>
                  </div>
                    <p className="side-column-topic-date">Created on {new Date(topic.date).toDateString()}</p>
                </div>
              </div>
            }
            
          </div>
        </div>
      );
}

export default MainPage;