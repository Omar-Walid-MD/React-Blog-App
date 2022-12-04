import {useState, useEffect } from "react"
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

import MainPage from "./Main Page/MainPage";
import PostPage from "./Post Page/PostPage";

import RegisterPage from "./Account Pages/RegisterPage";
import LoginPage from "./Account Pages/LoginPage";

import UserActivityPage from "./User Pages/UserActivityPage";
import SavedPage from "./User Pages/SavedPage";

import WritePage from "./Submit Pages/NewPostPage";
import CreateTopicPage from "./Submit Pages/NewTopicPage";

import './Main Page/MainPage.css';



function App()
{
  const navigate = useLocation();

  const [users,setUsers] = useState(null);
  const [topics,setTopics] = useState(null);
  const [posts,setPosts] = useState(null);

  const [currentUser,setCurrentUser] = useState(null);

  useEffect(()=>{

    fetch('http://localhost:8000/posts')
    .then(res => {
      return res.json()
    })
    .then((data)=>{
    //   console.log(data);
    setPosts(data);
    })

    fetch('http://localhost:8000/users')
    .then(res => {
      return res.json()
    })
    .then((data)=>{
    setUsers(data);

    //Reset user from database if there are manually added changes
    // localStorage.setItem("currentUser", JSON.stringify(data.filter((user)=>user.id==="user-4499347254")));
    })

    fetch('http://localhost:8000/topics')
    .then(res => {
      return res.json()
    })
    .then((data)=>{
    setTopics(data);
    })

    setCurrentUser(JSON.parse(localStorage.getItem("currentUser")));

    


    console.log("reload");


  },[navigate.pathname]);


  return (
    <Routes>
      <Route path="/" element={<MainPage posts={posts} topics={topics} currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
      <Route path="/write" element={<WritePage topics={topics} handlePostList={setPosts} currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
      <Route path="/post/:id" element={<PostPage posts={posts} topics={topics} currentUser={currentUser} setCurrentUser={setCurrentUser} users={users} />} />

      <Route path="/new-topic" element={<CreateTopicPage currentUser={currentUser} topics={topics} setCurrentUser={setCurrentUser} topics={topics} setTopics={setTopics} />} />
      <Route path="/topic/:id" element={<MainPage posts={posts} topics={topics} currentUser={currentUser} setCurrentUser={setCurrentUser} />} />

      <Route path="/register" element={<RegisterPage userList={users} handleUserList={setUsers} handleUser={setCurrentUser} />} />
      <Route path="/login" element={<LoginPage userList={users} handleUser={setCurrentUser} />} />

      <Route path="/user/:id" element={<UserActivityPage posts={posts} topics={topics} currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
      <Route path="/saved" element={<SavedPage posts={posts} topics={topics} currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
    </Routes>
    
  );
}

export default App;
