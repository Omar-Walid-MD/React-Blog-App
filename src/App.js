import {useState, useEffect} from "react"
import { Routes, Route } from "react-router-dom";
import MainPage from "./MainPage";
import WritePage from "./WritePage";
import './MainPage.css';
import RegisterPage from "./RegisterPage";



function App()
{

  const [posts,setPosts] = useState();
  const [users,setUsers] = useState();

  useEffect(()=>{

    fetch('http://localhost:8000/posts')
    .then(res => {
      return res.json()
    })
    .then((data)=>{
    //   console.log(data);
    setPosts(data);
    console.log(data);
    })

    fetch('http://localhost:8000/users')
    .then(res => {
      return res.json()
    })
    .then((data)=>{
    //   console.log(data);
    setUsers(data);
    console.log(data);
    })

  },[])

  return (
    <Routes>
      <Route path="/" element={<MainPage posts={posts} />} />
      <Route path="/write" element={<WritePage handlePostList={setPosts} />} />

      <Route path="/register" element={<RegisterPage />} />
    </Routes>
    
  );
}

export default App;
