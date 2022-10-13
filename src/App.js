import logo from './logo.svg';
import './main-page.css';


function Post({title,body})
{
  return(
    <div className="post-container flex-column">
      <div className="post-info">
        <p className="post-date">posted by OmarWalid 25 minutes ago</p>
        <h1 className="post-title">{title}</h1>
        <p className="post-body">{body}</p>
      </div>
      <div className="post-bottom-bar flex-row">
        <div className="post-options flex-row">
          <div className="post-votes-container flex-row">
            <p>Like</p>
            <p>0</p>
            <p>Dislike</p>
          </div>
          <div>Comments(5)</div>
          <div>Save</div>
        </div>
      </div>

    </div>
  )
}

function App()
{

  let posts = [
    {
      title: "Hello, this is my first blog post",
      body: "This is a random project of a blog app to add to my resume"
    },
    {
      title: "A second post",
      body: "Just a second post to test the page"
    },

  ]

  return (
    <div className="main-page">
      <header className="navbar flex-row">
        <div>
          <h1 className="navbar-logo">BLOG APP</h1>
        </div>
        <div className="navbar-options flex-row">
          <p>LINK</p>
          <p>LINK</p>
        </div>
      </header>
      <div className="page-container flex-center">
        <div className="main-column flex-column">
          <div className="blog-sort-container">

          </div>
          {
            posts.map((post)=>
              <Post title={post.title} body={post.body} />
            )
          }
        </div>
      </div>
    </div>
  );
}

export default App;
