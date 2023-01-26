import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";

import TopicLogo from "./TopicLogo";

import "./logo.css";
import "./MainPage.css";

function Notif({notif,currentUser,setRead})
{
    const [user,setUser] = useState();
    const [comment,setComment] = useState();
    const [post,setPost] = useState();
    const [topic,setTopic] = useState();

    useEffect(()=>{

        if(!user)
        {
            fetch('http://localhost:8000/users/'+notif.user)
            .then(res => {
            return res.json()
            })
            .then((data)=>{
    
                setUser(data);
                // console.log(data);
            });
        }

        if(!comment)
        {

            fetch('http://localhost:8000/comments/'+notif.comment)
            .then(res => {
            return res.json()
            })
            .then((data)=>{
    
                setComment(data);
            });
        }

        if(!post)
        {
            fetch('http://localhost:8000/posts/'+notif.post)
            .then(res => {
            return res.json()
            })
            .then((data)=>{
    
                setPost(data);
            });
        }

        if(!topic)
        {
            fetch('http://localhost:8000/topics/'+notif.topic)
            .then(res => {
            return res.json()
            })
            .then((data)=>{
    
                setTopic(data);
            });
        };

    },[notif]);

    return (
        <div to={"/post/"+notif.post}  target="_blank" read={notif.state==="read" ? "true" : "false"} className="notification-container flex-row">
        {/* {
            topic && 
            <TopicLogo topicLogo={topic.logo}/>
        } */}
        {   user && comment && post && topic &&
            <Link to={"/post/"+notif.post}  target="_blank"  className="notification-content flex-column" onClick={function(){setRead(currentUser,notif)}}>
                <div className="notification-header flex-row">
                    <TopicLogo topicLogo={topic.logo}/>
                    <div className="notification-topic">{topic.title}</div>
                </div>
            {
                
                notif.type==="comment-tag"
                ? <div><b className="notification-username">{user.username}</b> has <b>mentioned</b> you in a comment on: <p className="notification-post">"{post.title}"</p></div>
                : notif.type==="post-tag"
                ? <div><b className="notification-username">{user.username}</b> has <b>mentioned</b> you on: <p className="notification-post">"{post.title}"</p></div>
                : notif.type==="reply"
                ? <div><b className="notification-username">{user.username}</b> has <b>replied</b> to you: <h3 className="notification-reply">"{comment.text}"</h3> on: <p className="notification-post">"{post.title}"</p></div>
                : notif.type==="comment"
                && <div><b className="notification-username">{user.username}</b> has <b>commented</b> on your post: <p className="notification-post">"{post.title}"</p></div>

            }
            </Link>
        }
        {
            notif.state!=="read" &&
            <button className="notification-mark-as-read-button flex-center" onClick={function(){setRead(currentUser,notif)}}><i className='bx bx-check-double'></i></button>
        }
        </div>
    )
}

export default Notif;