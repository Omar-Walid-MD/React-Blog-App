import { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import "./write-page.css"

function WritePage({handlePostList})
{

    const navigate = useNavigate();

    const [newPost,setNewPost] = useState({
        id: "post-" + makeId(10),
        title: "",
        body: "",
        likes: 0,
        dislikes: 0
    });
    

    function handlePost(event)
    {
        setNewPost({
            ...newPost,
            [event.target.name]: event.target.value
        })

        console.log("title:"+newPost.title);
        console.log("body:"+newPost.body);
    }

    function submitPost(e)
    {
        e.preventDefault();

        fetch('http://localhost:8000/posts',{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newPost)
        }).then(()=>{
            console.log("New Post Added.");
            handlePostList(prevList => [...prevList,newPost])
        })

        navigate("/");
        return
    }


    function makeId(length)
    {
        let result = "";
        let chars = "123456789";
        for (var i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * 9)];
        }
        return result;
    }

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
                <form className="post-write-form-container flex-column" onSubmit={submitPost}>
                    <div className="post-write-form-input-group">
                        <input className="post-write-form-title-input" type="text" name="title" onChange={handlePost} />
                        <textarea className="post-write-form-body-input" name="body" onChange={handlePost}></textarea>
                    </div>
                    <div className="post-write-form-submit-container">
                        <input className="post-write-form-submit" type="submit" />
                    </div>
                </form>
              </div>
          </div>
        </div>
    );
}

export default WritePage;