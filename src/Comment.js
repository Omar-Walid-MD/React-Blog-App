
function Comment({comment,commentRef})
{
    return (
        <div className="post-page-comment-container" id={comment.id} ref={commentRef}>
            <p className="post-page-comment-info">By {comment.user} at {new Date(comment.date).toDateString()} {new Date(comment.date).toLocaleTimeString()} </p>
            <p className="post-page-comment-text">{comment.text}</p>
        </div>
    )
}

export default Comment;