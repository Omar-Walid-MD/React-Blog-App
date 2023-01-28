import {useState, useEffect} from "react"
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from 'axios';

import Navbar from "./Navbar";
import Post from "../User Pages/Post";
import TopicLogo from "./TopicLogo";
import i18next from "i18next";

import './MainPage.css';
import "../Submit Pages/WritePage.css";
import Footer from "./Footer";

function MainPage({posts, topics, currentUser, setCurrentUser})
{
    const [tr,il8n] = useTranslation();

    let topicId = useParams().id;

    const [topic,setTopic] = useState(null);

    const [buttonLock,setButtonLock] = useState(false);

    function lockButtons()
    {
        setButtonLock(true);
        setTimeout(() => {
            setButtonLock(false);
        }, 100);
    }

    function GetPostsForTopic(topic)
    {
      if(currentUser)
      {
        return topic ? posts.filter((post)=>post.topic===topic.id) : posts.filter((post)=>currentUser.subbedTopics.includes(post.topic));
      }
      else
      {
        return topic ? posts.filter((post)=>post.topic===topic.id) : [];
      }
    }

    function sortPosts(postList)
    {
      return postList.sort().slice().reverse();
    }

    function IsTopicSubbed(topicId)
    {
      return currentUser && currentUser.subbedTopics.includes(topicId);
    }

    function SetTopicSubbed(topicId)
    {

      let newSubbedTopics = [];

      if(IsTopicSubbed(topicId))
      {
        newSubbedTopics = currentUser.subbedTopics.filter((subbedTopic)=>subbedTopic!==topicId);
      }
      else
      {
        newSubbedTopics = [...currentUser.subbedTopics,topicId];
      }

      let updatedUser = {
        ...currentUser,
        subbedTopics: newSubbedTopics
      }
      
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

      let updatedTopic = {
        ...topic,
        members: topic.members + (newSubbedTopics.includes(topic.id) ? 1 : -1)
      }

      axios.put('http://localhost:8000/topics/'+topic.id,
        updatedTopic
      )
      .then(resp =>{
          setTopic(updatedTopic);
      }).catch(error => {
          console.log(error);
      });
    }

    function setLanguage(lang)
    {
      i18next.changeLanguage(lang);
      document.body.setAttribute("lng",lang);
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
        <div className="main-page" lng={i18next.language}>
          <Navbar topics={topics} currentUser={currentUser} setCurrentUser={setCurrentUser} />
          <div className="page-container flex-center">
            <div className="main-column flex-column">
              <div className="blog-sort-container flex-row">
                {
                  currentUser && 
                  <Link className="button write-post-button" to={"/write"} state={{topicForPost: topicId}}>{tr("mainPage.writePost")}</Link>
                }
              </div>
              <div className="main-column-post-group">
              {
                posts ? GetPostsForTopic(topic).length>0 ? sortPosts(GetPostsForTopic(topic)).map((post)=>
                  <Post post={post} currentUser={currentUser} setCurrentUser={setCurrentUser} key={"post"+post.id} />
                ) : <div className="blog-empty-label flex-center"><h1>{tr("mainPage.mustBeLoggedIn")}</h1></div>
                : <div className="blog-empty-label flex-center"><img src={require("../img/loading.png")} /></div>
              }
              </div>
            </div>
            {
             topic &&
              <div className="side-column">
                <div className="side-column-container flex-column">
                  <div className="side-column-topic-overview flex-column">
                    <TopicLogo topicLogo={topic.logo}/>
                    <div>
                      <h1 className="side-column-topic-title">{topic.title}</h1>
                      <p className="side-column-topic-desc">{topic.description}</p>
                    </div>
                  </div>
                  <div className="side-column-topic-info">
                    <div className="side-column-topic-status flex-row">
                      <p className="side-column-topic-members">{topic.members} {tr("mainPage.members")}</p>
                      <button className="button side-column-topic-sub-button" subbed={IsTopicSubbed(topicId) ? "true" : "false"} onClick={function(){if(!buttonLock){SetTopicSubbed(topicId); lockButtons();}}}>{IsTopicSubbed(topicId) ? tr("mainPage.unsub") : tr("mainPage.sub")}</button>
                    </div>
                    <p className="side-column-topic-date">{tr("mainPage.createdOn")} {new Date(topic.date).toDateString()}</p>
                  </div>
                </div>
              </div>
            }
          </div>
          <Footer setLanguage={setLanguage} />
        </div>
      );
}

export default MainPage;