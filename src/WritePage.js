import { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import Header from "./Header"
import "./WritePage.css"

function WritePage({handlePostList, currentUser})
{
    const navigate = useNavigate();

    const [newPost,setNewPost] = useState({
        title: "",
        body: "",
        
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

        let postToAdd = {
            ...newPost,
            id: "post-" + makeId(10),
            likes: 0,
            dislikes: 0,
            date: Date.now()
        }

        fetch('http://localhost:8000/posts',{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(postToAdd)
        }).then(()=>{
            console.log("New Post Added.");
            handlePostList(prevList => [...prevList,postToAdd])
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
            <Header currentUser={currentUser} />
            <div className="page-container flex-center">
                <div className="main-column flex-column">
                    <form className="post-write-form-container flex-column" onSubmit={submitPost}>
                        <h1 className="post-write-form-label">Write a post</h1>
                        <div className="post-write-form-input-group">
                            <input className="post-write-form-title-input" type="text" name="title" placeholder="Enter Title" onChange={handlePost} />
                            <textarea className="post-write-form-body-input" name="body" onChange={handlePost} placeholder="Enter Body"></textarea>
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