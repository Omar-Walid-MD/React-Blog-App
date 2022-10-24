import { useRef, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import Header from "./Header"
import "./WritePage.css"

function WritePage({handlePostList, topics, currentUser, setCurrentUser})
{
    const navigate = useNavigate();

    const [newPost,setNewPost] = useState({
        title: "",
        body: "",
        topic: "",
        
    });
    
    function handlePost(event)
    {
        setNewPost({
            ...newPost,
            [event.target.name]: event.target.value
        })

        console.log(newPost);
    }

    function submitPost(e)
    {
        e.preventDefault();

        if(newPost.topic!=="")
        {
            let postToAdd = {
                ...newPost,
                id: "post-" + makeId(10),
                likes: 0,
                dislikes: 0,
                user: currentUser.username,
                comments: [],
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
    
            navigate("/post/"+postToAdd.id);
            return
        }
        else
        {
            console.log("Topic invalid")
        }

    }

    const WritePageForm = useRef();

    function readyToSubmit()
    {
        let allInputs = null;
        if(WritePageForm.current)
        {
            allInputs = WritePageForm.current.querySelectorAll(":required");
            console.log([...allInputs].filter((formInput)=>formInput.value==='').length);
            return [...allInputs].filter((formInput)=>formInput.value==='').length > 0;
        }
        else
        {
            return true;
        }

        
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
        <Header topics={topics} currentUser={currentUser} setCurrentUser={setCurrentUser} />
            <div className="page-container flex-center">
                <div className="main-column flex-column">
                    <form className="post-write-form-container flex-column" ref={WritePageForm} onSubmit={submitPost}>
                        <div className="post-write-post-to-form-row flex-row">
                            <h1 className="post-write-form-label">Submit Post to: </h1>
                            <select className="post-write-form-select-topic" name="topic" onChange={handlePost} required>
                                <option value={""}>--Select Topic--</option>
                                {
                                    topics && topics.map((topic)=>
                                    <option value={topic.id} key={topic.id}>{topic.title}</option>
                                    )
                                }
                            </select>
                        </div>
                        <div className="post-write-form-input-group">
                            <input className="post-write-form-title-input" type="text" name="title" placeholder="Enter Title" onChange={handlePost} required/>
                            
                            <textarea className="post-write-form-body-input" name="body" placeholder="Enter Body" onChange={handlePost} required></textarea>
                        </div>
                        <div className="post-write-form-submit-container">
                            <input className="post-write-form-submit" type="submit" disabled={readyToSubmit()} />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default WritePage;