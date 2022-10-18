
function Comment({comment})
{
    return (
        <div className="post-page-comment-container">
            <p className="post-page-comment-info">By {comment.user} at {new Date(comment.date).toDateString()} {new Date(comment.date).toLocaleTimeString()} </p>
            <p className="post-page-comment-text">{comment.text}</p>
        </div>
    )
}

export default Comment;