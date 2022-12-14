import { useEffect, useRef, useState } from "react";
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';

import Header from "../Main Page/Header";
import TopicLogo from "../Main Page/TopicLogo";

import "./WritePage.css"


function SelectTopic({topic, newPost, setNewPost})
{
    function handlePostTopic()
    {
        setNewPost({
            ...newPost,
            topic: topic.id
        })
    }

    return (
        <button className="select-topic-button flex-row" onClick={handlePostTopic}>
            <TopicLogo topicLogo={topic.logo} width={40} />
            <div className="select-topic-info flex-column">
                <p className="select-topic-info-title">{topic.title}</p>
                <p className="select-topic-info-members">{topic.members} members</p>
            </div>
        </button>);
}


function NewPostPage({handlePostList, topics, currentUser, setCurrentUser, users})
{
    const navigate = useNavigate();

    const { topicForPost } = useLocation().state;

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
        console.log(newPost);
    },[topicForPost]);

    return (
        <div className="main-page">
        <Header topics={topics} currentUser={currentUser} setCurrentUser={setCurrentUser} />
            <div className="page-container flex-center">
                <div className="main-column flex-column">
                    <form className="post-write-form-container flex-column" onSubmit={submitPost}>
                        <div className="post-write-form-row flex-row">
                            <h1 className="post-write-form-label">Submit Post to: </h1>
                            <div className="post-write-form-select-topic-container flex-center">
                            {
                                newPost.topic !=="" ?
                                <div className="selected-topic-container flex-row">
                                    <TopicLogo topicLogo={GetTopicFromId(newPost.topic).logo} width={60} />
                                    <div className="select-topic-info flex-column">
                                        <p className="select-topic-info-title">{GetTopicFromId(newPost.topic).title}</p>
                                        <p className="select-topic-info-members">{GetTopicFromId(newPost.topic).members} members</p>
                                    </div>
                                    <button className="selected-topic-reset-button flex-center" name="topic" value="" onClick={function(event){handlePost(event)}}><i className='bx bx-x-circle'></i></button>
                                </div>
                                :
                                <div className="post-write-form-select-topic-open flex-center">
                                    <div className="post-write-form-select-topic-open-label flex-center">--Select Topic--</div>
                                    <div className="post-write-form-select-topic-menu flex-row">
                                        <div className="post-write-form-select-topic-menu-section">
                                            <div className="post-write-form-select-topic-menu-label-container">
                                                <h2>Joined Topics:</h2>
                                            </div>
                                            <div className="post-write-form-select-topic-results">
                                            {
                                                topics && topics.filter((topic)=>currentUser.subbedTopics.includes(topic.id)).map((topic)=>
                                                <div>
                                                    <SelectTopic topic={topic} newPost={newPost} setNewPost={setNewPost}/>
                                                </div>
                                                )
                                            }
                                            </div>
                                        </div>
                                        <div className="post-write-form-select-topic-menu-section">
                                            <div className="post-write-form-select-topic-menu-label-container">
                                                <h2>Search Topics:</h2>
                                                <input className="post-write-form-select-topic-search" type="search" value={searchTopic} onChange={handleSearchTopic} />
                                            </div>
                                            <div className="post-write-form-select-topic-results">
                                            {
                                                topics && searchTopic!=="" && GetSearchResults(searchTopic).map((topic)=>
                                                <div>
                                                    <SelectTopic topic={topic} newPost={newPost} setNewPost={setNewPost}/>
                                                </div>
                                                )
                                            }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                            </div>
                            {/* <select className="post-write-form-select-topic" name="topic" value={newPost.topic} onChange={handlePost} required>
                                <option value={""}>--Select Topic--</option>
                                {
                                    topics && topics.map((topic)=>
                                    <option value={topic.id} key={topic.id}>{topic.title}</option>
                                    )
                                }
                            </select> */}
                        </div>
                        <div className="post-write-form-input-group">
                            <textarea className="post-write-form-title-input" type="text" name="title" placeholder="Enter Title" minheight={50} value={newPost.title} onChange={handlePost} onInput={AutoResize} required></textarea>
                            
                            <textarea className="post-write-form-body-input" name="body" placeholder="Enter Body" minheight={200} value={newPost.body} onChange={handlePost} onInput={AutoResize} required></textarea>
                        </div>
                        <div className="post-write-form-submit-container">
                            <input className="post-write-form-submit" type="submit" disabled={NotReadyToSubmit()} />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default NewPostPage;