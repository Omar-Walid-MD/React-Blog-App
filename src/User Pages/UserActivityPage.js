import {useState, useEffect} from "react"
import { Link, useLocation, useParams } from "react-router-dom";
import axios from 'axios';
import { useTranslation } from "react-i18next";

import Navbar from "../Main Page/Navbar";
import Post from "./Post";
import Comment from "./Comment";
import Avatar from "../Main Page/Avatar";

import "../Post Page/PostPage.css"
import '../Main Page/MainPage.css';
import "./UserActivityPage.css"
import Footer from "../Main Page/Footer";



function UserActivityPage({posts, topics, currentUser, setCurrentUser, users})
{
    const [tr,il8n] = useTranslation();

    let userId = useParams().id;

    const [user,setUser] = useState();

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

      return contents.filter((content)=>content.user.id===user.id);
    }

    function SortContent(contents)
    {
        return contents.sort().slice().reverse();
    }

    useEffect(()=>{
      
      if(!user)
      {
        fetch('http://localhost:8000/users/'+userId)
        .then(res => {
          return res.json()
        })
        .then((data)=>{
        setUser(data);
        })
      }
    },[userId]);

    useEffect(()=>{

      fetch('http://localhost:8000/comments')
      .then(res => {
        return res.json()
      })
      .then((data)=>{
      setComments(data);
      })
  
    },[posts]);

    return (
        <div className="main-page">
        <Navbar topics={topics} currentUser={currentUser} setCurrentUser={setCurrentUser} />
          <div className="page-container flex-center">
            <div className="main-column flex-column">
              <div className="activity-page-option-row flex-row">
                <button className="activity-page-option-button" name="overview" current={currentTab === "overview" ? "true" : "false"} onClick={handleCurrentTab} >{tr("userPages.overview")}</button>
                <button className="activity-page-option-button" name="posts" current={currentTab === "posts" ? "true" : "false"} onClick={handleCurrentTab} >{tr("userPages.posts")}</button>
                <button className="activity-page-option-button" name="comments" current={currentTab === "comments" ? "true" : "false"} onClick={handleCurrentTab} >{tr("userPages.comments")}</button>
              </div>
              <div className="activity-page-content-container">
              {
                user && comments && posts ? SortContent(GetContent(currentTab)).length > 0 ?
                SortContent(GetContent(currentTab)).map((content)=>
                  content.type==="post" ? <Post post={content} key={content.id} currentUser={currentUser} setCurrentUser={setCurrentUser} users={users} /> : content.type==="comment" && <Comment comment={content} posts={posts} key={content.id} currentUser={currentUser} setCurrentUser={setCurrentUser}/>
                 )
                 : <div className="blog-empty-label flex-center"><h1>{tr("userPages.noContent")}</h1></div>
                 : <div className="blog-empty-label flex-center"><img src={require("../img/loading.png")} /></div>
              }
              </div>
            </div>
            {
              user &&
              <div className="side-column">
                <div className="side-column-container flex-column">
                  <Avatar bgImg={user.avatar.bgImg} bgColor={user.avatar.bgColor} baseColor={user.avatar.baseColor} accImg={user.avatar.accImg} accColor={user.avatar.accColor} width={200} />
                  <h1>{user.username}</h1>
                </div>
              </div>
            }
          </div>
          <Footer />
        </div>
      );
}

export default UserActivityPage;