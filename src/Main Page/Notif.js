import { useEffect, useState } from "react";
import "./MainPage.css";
import TopicLogo from "./TopicLogo";

function Notif({type,userId,commentId,postId,topicId})
{
    const [user,setUser] = useState();
    const [comment,setComment] = useState();
    const [post,setPost] = useState();
    const [topic,setTopic] = useState();

    useEffect(()=>{

        if(!user)
        {
            fetch('http://localhost:8000/users/'+userId)
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

            fetch('http://localhost:8000/comments/'+commentId)
            .then(res => {
            return res.json()
            })
            .then((data)=>{
    
                setComment(data);
            });
        }

        if(!post)
        {
            fetch('http://localhost:8000/posts/'+postId)
            .then(res => {
            return res.json()
            })
            .then((data)=>{
    
                setPost(data);
            });
        }

        if(!topic)
        {
            fetch('http://localhost:8000/topics/'+topicId)
            .then(res => {
            return res.json()
            })
            .then((data)=>{
    
                setTopic(data);
            });
        };

    },[userId,commentId, postId, topicId]);

    return (
        <div className="notification-container flex-row">
        {
            topic && <TopicLogo topicLogo={topic.logo} width={40}/>
        }
        {   user && comment && post && topic &&
            <div className="notification-content flex-column">
                <div className="notification-topic">{topic.title}</div>
            {
                
                type==="tag"
                ? <div><b className="notification-username">{user.username}</b> has <b>mentioned</b> you in a comment on: <p className="notification-post">"{post.title}"</p></div>
                : type==="reply"
                ? <div><b className="notification-username">{user.username}</b> has <b>replied</b> to you: <h3 className="notification-reply">"{comment.text}"</h3> on: <p className="notification-post">"{post.title}"</p></div>
                : type==="comment"
                && <div><b className="notification-username">{user.username}</b> has <b>commented</b> on your post: <p className="notification-post">"{post.title}"</p></div>

            }
            </div>
        }
        </div>
    )
}

export default Notif;