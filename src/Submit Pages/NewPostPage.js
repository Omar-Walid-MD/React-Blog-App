import { useEffect, useRef, useState } from "react";
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useTranslation } from "react-i18next";

import axios from 'axios';

import Navbar from "../Main Page/Navbar";
import TopicLogo from "../Main Page/TopicLogo";
import i18next from "i18next";

import Footer from "../Main Page/Footer";
import "./WritePage.css"


function SelectTopic({topic, newPost, setNewPost, setSelectTopicWindow})
{
    const [tr,il8n] = useTranslation();

    function handlePostTopic()
    {
        setNewPost({
            ...newPost,
            topic: topic.id
        });

        setSelectTopicWindow(false)
    }

    return (
        <button className="select-topic-button flex-row" onClick={handlePostTopic}>
            <TopicLogo topicLogo={topic.logo} />
            <div className="select-topic-info flex-column">
                <p className="select-topic-info-title">{topic.title}</p>
                <p className="select-topic-info-members">{topic.members} {tr("mainPage.members")}</p>
            </div>
        </button>);
}


function NewPostPage({handlePostList, topics, currentUser, setCurrentUser, users})
{
    const [tr,il8n] = useTranslation();

    const navigate = useNavigate();

    const { topicForPost } = useLocation().state;

    const [selectTopicWindow, setSelectTopicWindow] = useState(false);

    const [newPost,setNewPost] = useState({
        title: "",
        body: "",
        topic: topicForPost || "",
        
    });

    const [searchTopic,setSearchTopic] = useState("");
    
    function handlePost(event)
    {
        setNewPost({
            ...newPost,
            [event.currentTarget.name]: event.currentTarget.value
        });

        console.log(newPost);
    }

    function handleSearchTopic(event)
    {
        console.log(event.target.value);
        setSearchTopic(event.target.value);
    }

    function GetTopicFromId(topicId)
    {
        return topics.filter((topic)=>topic.id===topicId)[0];
    }

    function GetSearchResults(searchValue)
    {
        return topics.filter((topic)=>topic.title.toLowerCase().includes(searchValue.toLowerCase()));
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
                user: {username: currentUser.username, id: currentUser.id},
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
            });

            if(GetTags(postToAdd.body))
            {
                let tags = GetTags(postToAdd.body);

                let tagNotifs = [];

                for (let i = 0; i < tags.length; i++)
                {
                    const tag = tags[i];
                    tagNotifs.push(GetUserFromName(tag));
                }

                for (let i = 0; i < tagNotifs.length; i++)
                {
                    const targetUser = tagNotifs[i];
                    
                    let newNotif = {
                        type: "post-tag",
                        user: currentUser.id,
                        comment: "",
                        post: postToAdd.id,
                        topic: postToAdd.topic
                    };

                    SendNotif(newNotif,targetUser);
                    
                }
            }
    
            navigate("/post/"+postToAdd.id,{state: {submittedPost: postToAdd, submittedTopic: postToAdd.topic}});
            return
        }
        else
        {
            console.log("Topic invalid")
        }

    }

    function GetTags(commentText)
    {
        let textSplit = commentText.split(' ').filter((word)=> word[0]==='@').map((word)=>word.slice(1,word.length));
        return textSplit.length>0 ? textSplit : null;
    }

    function GetUserFromName(username)
    {
        for (let i = 0; i < users.length; i++)
        {
            const user = users[i];

            console.log(username);
            if(user.username===username)
            {
                console.log(user);
                return user;
            }
            
        }
    }

    function SendNotif(newNotif,targetUser)
    {
        let notifs = [...targetUser.notifs,newNotif];
    
        let updatedUser = {
            ...targetUser,
            notifs: notifs
        }

        axios.put('http://localhost:8000/users/'+updatedUser.id,
        updatedUser
        )
        .then(resp =>{
            console.log("Updated Target User Notifs");
        }).catch(error => {
            console.log(error);
        });
    }

    function NotReadyToSubmit()
    {
        for (const key in newPost)
        {
            if(newPost[key]==="") return true;
        }

        return false;
    }

    function AutoResize(event)
    {
        console.log(event.target.getAttribute("minheight"))
        event.target.style.minHeight = 0;
        event.target.style.minHeight = "max(" + event.target.getAttribute("minheight") + "px,"+(event.target.scrollHeight) + "px)" ;
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

    useEffect(()=>{
        // console.log(newPost);
    },[topicForPost]);

    return (
        <div className="main-page">
        <Navbar topics={topics} currentUser={currentUser} setCurrentUser={setCurrentUser} />
            <div className="page-container flex-center">
                <div className="main-column flex-column">
                    <form className="post-write-form-container flex-column" onSubmit={submitPost}>
                        <div className="post-write-form-row flex-row">
                            <h1 className="post-write-form-label">{tr("newPostPage.submitTo")} </h1>
                            <div className="post-write-form-select-topic-container flex-center">
                            {
                                topics && newPost.topic !=="" ?
                                <div className="selected-topic-container flex-row">
                                    <TopicLogo topicLogo={GetTopicFromId(newPost.topic).logo} />
                                    <div className="select-topic-info flex-column">
                                        <p className="select-topic-info-title">{GetTopicFromId(newPost.topic).title}</p>
                                        <p className="select-topic-info-members">{GetTopicFromId(newPost.topic).members} {tr("mainPage.members")}</p>
                                    </div>
                                    <button className="selected-topic-reset-button flex-center" name="topic" value="" onClick={function(event){handlePost(event)}}><i className='bx bx-x-circle'></i></button>
                                </div>
                                :
                                <div className="post-write-form-select-topic-open flex-center">
                                    <button className="post-write-form-select-topic-open-button flex-center" type="button" onClick={function(){setSelectTopicWindow(true)}}>({tr("newPostPage.select")})</button>
                                </div>
                            }
                            </div>
                        </div>
                        <div className="post-write-form-input-group">
                            <textarea className="post-write-form-title-input" type="text" name="title" placeholder={tr("newPostPage.enterTitle")} minheight={50} value={newPost.title} onChange={handlePost} onInput={AutoResize} required></textarea>
                            
                            <textarea className="post-write-form-body-input" name="body" placeholder={tr("newPostPage.enterBody")} minheight={200} value={newPost.body} onChange={handlePost} onInput={AutoResize} required></textarea>
                        </div>
                        <div className="post-write-form-submit-container">
                            <input className="button post-write-form-submit" type="submit" value={tr("newPostPage.submit")} disabled={NotReadyToSubmit()} />
                        </div>
                    </form>
                </div>
                {
                    selectTopicWindow &&
                    <div className="window-overlay flex-center">
                        <div className="post-write-form-select-topic-menu flex-column">
                            <h1>{tr("newPostPage.select")}</h1>
                            <div className="post-write-form-select-topic-menu-section-group flex-row">
                                <div className="post-write-form-select-topic-menu-section">
                                    <div className="post-write-form-select-topic-menu-label-container">
                                        <h2>{tr("newPostPage.joinedTopics")}</h2>
                                    </div>
                                    <div className="post-write-form-select-topic-results">
                                    {
                                        topics && topics.filter((topic)=>currentUser.subbedTopics.includes(topic.id)).map((topic)=>
                                        <div>
                                            <SelectTopic topic={topic} newPost={newPost} setNewPost={setNewPost} setSelectTopicWindow={setSelectTopicWindow}/>
                                        </div>
                                        )
                                    }
                                    </div>
                                </div>
                                <div className="post-write-form-select-topic-menu-section">
                                    <div className="post-write-form-select-topic-menu-label-container">
                                        <h2>{tr("newPostPage.searchTopics")}</h2>
                                        <input className="post-write-form-select-topic-search" type="search" value={searchTopic} onChange={handleSearchTopic} />
                                    </div>
                                    <div className="post-write-form-select-topic-results">
                                    {
                                        topics && searchTopic!=="" && GetSearchResults(searchTopic).map((topic)=>
                                        <div>
                                            <SelectTopic topic={topic} newPost={newPost} setNewPost={setNewPost} setSelectTopicWindow={setSelectTopicWindow}/>
                                        </div>
                                        )
                                    }
                                    </div>
                                </div>
                            </div>
                            <button className="button post-write-form-select-topic-menu-close" onClick={function(){setSelectTopicWindow(false)}}>{tr("newPostPage.close")}</button>
                        </div>
                    </div>

                }
            </div>
            <Footer />
        </div>
    );
}

export default NewPostPage;