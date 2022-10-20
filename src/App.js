import {useState, useEffect } from "react"
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import MainPage from "./MainPage";
import WritePage from "./WritePage";
import PostPage from "./PostPage";
import './MainPage.css';
import RegisterPage from "./RegisterPage";
import LoginPage from "./LoginPage";
import UserActivityPage from "./UserActivityPage";
import SavedPage from "./SavedPage";



function App()
{
  const navigate = useLocation();

  const [posts,setPosts] = useState(null);
  const [users,setUsers] = useState(null);
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
    // setCurrentUser(JSON.parse(localStorage.setItem("currentUser")));
    })

    setCurrentUser(JSON.parse(localStorage.getItem("currentUser")));

    console.log("reload");


  },[navigate.pathname]);


  return (
    <Routes>
      <Route path="/" element={<MainPage posts={posts} currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
      <Route path="/write" element={<WritePage handlePostList={setPosts} currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
      <Route path="/post/:id" element={<PostPage posts={posts}  currentUser={currentUser} setCurrentUser={setCurrentUser} />} />

      <Route path="/register" element={<RegisterPage handleUserList={setUsers} handleUser={setCurrentUser} />} />
      <Route path="/login" element={<LoginPage userList={users} handleUser={setCurrentUser} />} />

      <Route path="/activity" element={<UserActivityPage posts={posts} currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
      <Route path="/saved" element={<SavedPage posts={posts} currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
    </Routes>
    
  );
}

export default App;
