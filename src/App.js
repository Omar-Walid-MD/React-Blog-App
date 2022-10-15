import {useState, useEffect} from "react"
import { Routes, Route } from "react-router-dom";
import MainPage from "./MainPage";
import WritePage from "./WritePage";
import './MainPage.css';
import RegisterPage from "./RegisterPage";
import LoginPage from "./LoginPage";



function App()
{

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
    // console.log(data);
    })

    setCurrentUser(JSON.parse(localStorage.getItem("currentUser")));

    // console.log(JSON.parse(localStorage.getItem("currentUser")));

  },[])

  return (
    <Routes>
      <Route path="/" element={<MainPage posts={posts} currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
      <Route path="/write" element={<WritePage handlePostList={setPosts} currentUser={currentUser} setCurrentUser={setCurrentUser} />} />

      <Route path="/register" element={<RegisterPage handleUserList={setUsers} handleUser={setCurrentUser} />} />
      <Route path="/login" element={<LoginPage userList={users} handleUser={setCurrentUser} />} />
    </Routes>
    
  );
}

export default App;
