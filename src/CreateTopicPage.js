import {useState, useEffect, useRef} from "react"
import { Link, useNavigate } from "react-router-dom";

import Header from "./Header";
import Post from "./Post";

import './WritePage.css';

function CreateTopicPage({currentUser,setCurrentUser, topics, setTopics})
{

    const navigate = useNavigate();

    const [newTopic,setNewTopic] = useState({
        title: "",
        description: "",
        
    });
    

    function handleTopic(event)
    {
        setNewTopic({
            ...newTopic,
            [event.target.name]: event.target.value
        })
    }

    function submitTopic(e)
    {
        e.preventDefault();

        if(topics.filter((topic)=>topic.title.toLowerCase()===newTopic.title.toLowerCase()).length===0)
        {
            let topicToAdd = {
                ...newTopic,
                id: "topic-" + makeId(10),
                posts: [],
                members: 0,
                date: Date.now()
            }
    
            fetch('http://localhost:8000/topics',{
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(topicToAdd)
            }).then(()=>{
                console.log("New Post Added.");
                setTopics(prev => [...prev,topicToAdd])
            })
    
            navigate("/topic/"+topicToAdd.id);
            return
        }
        else
        {
            console.log("Topic already exists!")
        }

    }

    const CreateTopicForm = useRef();

    function readyToSubmit()
    {
        let allInputs = null;
        if(CreateTopicForm.current)
        {
            allInputs = CreateTopicForm.current.querySelectorAll(":required");
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
                    <form className="post-write-form-container flex-column" ref={CreateTopicForm} onSubmit={submitTopic}>
                        <div className="post-write-post-to-form-row">
                            <h1 className="post-write-form-label">Create a new topic</h1>
                        </div>
                        <div className="post-write-form-input-group">
                            <input className="post-write-form-title-input" type="text" name="title" placeholder="Your interesting topic..." value={newTopic.title} onChange={handleTopic} required />
                            <textarea className="post-write-form-body-input" name="description" maxLength={150}  placeholder="A brief description of your topic..." value={newTopic.description} onChange={handleTopic} required ></textarea>
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

export default CreateTopicPage;