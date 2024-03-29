import {useState, useEffect, useRef} from "react"
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import axios from 'axios';

import Navbar from "../Main Page/Navbar";
import TopicLogo from "../Main Page/TopicLogo";

import Footer from "../Main Page/Footer";
import './WritePage.css';

function NewTopicPage({currentUser,setCurrentUser, topics, setTopics})
{
    const [tr,il8n] = useTranslation();

    const navigate = useNavigate();

    const [newTopic,setNewTopic] = useState({
        title: "",
        description: "",
        
    });

    const [topicLogo,setTopicLogo] = useState({
        bgImg: 1,
        bgColor: "#0b0404",
        fgImg: 1,
        fgColor: "#ffffff"
    });

    const [topicLogoWindow,setTopicLogoWindow] = useState(false);

    const bgImages = 5; const fgImages = 40;
    
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
                logo: topicLogo,
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

            let updatedUser = {
                ...currentUser,
                subbedTopics: [...currentUser.subbedTopics,topicToAdd.id]

            }
    
            axios.put('http://localhost:8000/users/'+updatedUser.id,
            updatedUser
            )
            .then(resp =>{
                console.log("Updated User Subbed Topics");
                localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                setCurrentUser(updatedUser);
                navigate("/topic/"+topicToAdd.id);
            }).catch(error => {
                console.log(error);
            });

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

    function handleTopicLogo(event)
    {
        setTopicLogo({
            ...topicLogo,
            [event.target.name]: event.target.value
        });

        console.log(topicLogo);
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
            <Navbar topics={topics} currentUser={currentUser} setCurrentUser={setCurrentUser} />
            <div className="page-container flex-center">
                <div className="main-column flex-column">
                    <form className="post-write-form-container flex-column" ref={CreateTopicForm} onSubmit={submitTopic}>
                        <h1 className="post-write-form-label">{tr("newTopicPage.createTopic")}</h1>
                        <div className="post-write-form-input-group">
                            <div className="post-write-post-to-form-row flex-row">
                                <div className="create-topic-form-topic-logo flex-center">
                                    <button className="create-topic-form-topic-logo-open-button" type="button" onClick={function(){setTopicLogoWindow(true)}}>{tr("accountPages.editAvatar")}</button>
                                    <TopicLogo topicLogo={topicLogo} width={150} />
                                </div>
                                <input className="create-topic-form-title-input" type="text" name="title" placeholder={tr("newTopicPage.enterTitle")} value={newTopic.title} onChange={handleTopic} required />
                            </div>
                            <textarea className="post-write-form-body-input" name="description" maxLength={150} placeholder={tr("newTopicPage.enterBody")} value={newTopic.description} onChange={handleTopic} required ></textarea>
                        </div>
                        <div className="post-write-form-submit-container">
                            <input className="button post-write-form-submit" type="submit" value={tr("newTopicPage.submit")} disabled={readyToSubmit()} />
                        </div>
                    </form>
                </div>
                {
                    topicLogoWindow &&
                    <div className="window-overlay flex-center">
                        <div className="topic-logo-options-container flex-column">
                            <h1>{tr("accountPages.userAvatar")}</h1>
                            <div className="flex-row width-full">
                                <div className="topic-logo-preview">
                                    <TopicLogo topicLogo={topicLogo} width={150} />
                                </div>
                                <div className="topic-logo-color-option-row flex-row">
                                    <input className="topic-logo-color-option" type="color" name={"bgColor"} onChange={handleTopicLogo} />
                                    <input className="topic-logo-color-option" type="color" name={"fgColor"} onChange={handleTopicLogo} />
                                </div>
                            </div>
                            <div className="topic-logo-options-row flex-row">
                                <div className="topic-logo-image-options flex-row">
                                    {
                                        [...Array(bgImages).keys()].map((n)=>
                                        <button className="topic-logo-image-button flex-center" type="button" name="bgImg" value={n+1} style={{backgroundImage: 'url(' + require("../img/topic-logo/bg"+(n+1)+".png") + ')'}} onClick={function(event){handleTopicLogo(event)}} key={"bg-option-"+n}></button>
                                        )
                                    }
                                </div>
                            </div>
                            <div className="topic-logo-options-row flex-row">
                                <div className="topic-logo-image-options flex-row">
                                    {
                                        [...Array(fgImages).keys()].map((n)=>
                                        <button className="topic-logo-image-button flex-center" type="button" name="fgImg" value={n+1} style={{backgroundImage: 'url(' + require("../img/topic-logo/fg"+(n+1)+".png") + ')'}} onClick={function(event){handleTopicLogo(event)}} key={"fg-option-"+n}></button>
                                        )
                                    }
                                </div>
                            </div>
                            <button className="button topic-logo-save-button flex-center" onClick={function(){setTopicLogoWindow(false)}}>{tr("post.save")}</button>
                        </div>
                    </div>
                }                            
            </div>
            <Footer />
        </div>
      );
}

export default NewTopicPage;