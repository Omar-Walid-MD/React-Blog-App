import {useState, useEffect} from "react"
import { Routes, Route } from "react-router-dom";
import MainPage from "./main-page";
import './main-page.css';



function App()
{

  const [posts,setPosts] = useState();

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

  },[])

  return (
    <Routes>
      <Route path="/" element={<MainPage posts={posts} />} />
    </Routes>
    
  );
}

export default App;
