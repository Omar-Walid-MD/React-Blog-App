import { useEffect, useRef, useState } from "react";
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Header from "./Header"
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
            <div className="select-topic-logo topic-logo-background flex-center" style={{backgroundImage: 'url(' + require("./img/topic-logo/bg" + topic.logo.bgImg + ".png") + ')', backgroundColor: topic.logo.bgColor}}>
                <div className="topic-logo-foreground-shadow" style={{backgroundImage: 'url(' + require("./img/topic-logo/fg" + topic.logo.fgImg + ".png") + ')'}}></div>
                <div className="topic-logo-foreground" style={{maskImage: 'url(' + require("./img/topic-logo/fg" + topic.logo.fgImg + ".png") + ')', WebkitMaskImage: 'url(' + require("./img/topic-logo/fg" + topic.logo.fgImg + ".png") + ')', backgroundColor: topic.logo.fgColor}}></div>
            </div>
            <div className="select-topic-info flex-column">
                <p className="select-topic-info-title">{topic.title}</p>
                <p className="select-topic-info-members">{topic.members} members</p>
            </div>
        </button>);
}


function WritePage({handlePostList, topics, currentUser, setCurrentUser})
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
    
            navigate("/post/"+postToAdd.id,{state: {submittedPost: postToAdd, submittedTopic: postToAdd.topic}});
            return
        }
        else
        {
            console.log("Topic invalid")
        }

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
                                    <div className="select-topic-logo topic-logo-background flex-center" style={{backgroundImage: 'url(' + require("./img/topic-logo/bg" + GetTopicFromId(newPost.topic).logo.bgImg + ".png") + ')', backgroundColor: GetTopicFromId(newPost.topic).logo.bgColor}}>
                                        <div className="topic-logo-foreground-shadow" style={{backgroundImage: 'url(' + require("./img/topic-logo/fg" + GetTopicFromId(newPost.topic).logo.fgImg + ".png") + ')'}}></div>
                                        <div className="topic-logo-foreground" style={{maskImage: 'url(' + require("./img/topic-logo/fg" + GetTopicFromId(newPost.topic).logo.fgImg + ".png") + ')', WebkitMaskImage: 'url(' + require("./img/topic-logo/fg" + GetTopicFromId(newPost.topic).logo.fgImg + ".png") + ')', backgroundColor: GetTopicFromId(newPost.topic).logo.fgColor}}></div>
                                    </div>
                                    <div className="select-topic-info flex-column">
                                        <p className="select-topic-info-title">{GetTopicFromId(newPost.topic).title}</p>
                                        <p className="select-topic-info-members">{GetTopicFromId(newPost.topic).members} members</p>
                                    </div>
                                    <button className="selected-topic-reset-button flex-center" name="topic" value="" onClick={function(event){handlePost(event)}}><i className='bx bx-x-circle'></i></button>
                                </div>
                                :
                                <div className="post-write-form-select-topic-open flex-center">
                                    <h2>--Select Topic--</h2>
                                    <div className="post-write-form-select-topic-menu flex-row">
                                        <div className="post-write-form-select-topic-menu-section">
                                            <h2>Joined Topics:</h2>
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
                                            <h2>Search Topics:</h2>
                                            <input type="search" value={searchTopic} onChange={handleSearchTopic} />
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

export default WritePage;