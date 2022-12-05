
import { useEffect, useState } from "react";
import {Link, useLocation} from "react-router-dom";
import Avatar from "./Avatar";
import Notif from "./Notif";

import TopicLogo from "./TopicLogo";

function Header({topics, currentUser, setCurrentUser})
{
  const imgPath = "../img/topic-logo";

  let location = useLocation();

  const [searchValue,setSearchValue] = useState("");

  function handleSearchValue(event)
  {
    setSearchValue(event.target.value);
    console.log(searchValue);
  }

  function GetSearchResults(searchValue)
  {
    return topics.filter((topic)=>topic.title.toLowerCase().includes(searchValue.toLowerCase()));
  }

  function GetNofitications(currentUser)
  {
    console.log(currentUser.notifs);
    return currentUser.notifs.slice().reverse();
  }

  function LogOut(e)
  {
    setCurrentUser(null);
    localStorage.setItem('currentUser', JSON.stringify(null));

    window.location.reload();
    
  }

  useEffect(()=>{
    setSearchValue("");
    console.log("oops");
  },[location])

    return (
        <header className="navbar flex-row">
            <Link to="/" className="navbar-logo">BLOGGEST</Link>
            <div className="navbar-search-container flex-center">
              <input className="navbar-search-input" type="search" placeholder="Search for topics..." value={searchValue} onChange={handleSearchValue} />
              
                
                  {
                    searchValue!=="" &&
                    <div className="navbar-search-dropdown">
                      <div className="navbar-search-results">
                        {
                          GetSearchResults(searchValue).length > 0 ?

                          GetSearchResults(searchValue).map((topic)=>
                          <Link to={"/topic/"+topic.id} className="topic-result-container flex-row" key={topic.id}>
                             <TopicLogo topicLogo={topic.logo} width={100} />
                            <div className="topic-result-info">
                              <h2 className="topic-result-title">{topic.title}</h2>
                              <p className="topic-result-members">{topic.members} Members</p>
                            </div>
                          </Link>
                          )
                          : <h1 className="topic-results-empty">No results for "{searchValue}"</h1>
                        }
                      </div>
                      <div className="navbar-create-topic-tab-container">
                        <Link to={"/new-topic"} className="navbar-create-topic-link flex-row"><div className="navbar-create-topic-circle flex-center"><i className='bx bx-plus-medical add-icon'></i></div>Create New Topic</Link>
                      </div>
                  </div>
                  }
                
              </div>
          {
            currentUser ? 
            <div className="navbar-options-loggedin flex-row">
              <div className="navbar-notif-menu flex-center">
                <input type="checkbox" className="navbar-notif-checkbox hidden-checkbox" id="navbar-notif-checkbox"/>
                <label htmlFor="navbar-notif-checkbox" className="navbar-notif-button">
                  <i className='bx bx-bell'></i>
                </label>
                <div className="navbar-notif-dropdown-container">
                  {
                    GetNofitications(currentUser).map((notif)=>
                    <Notif type={notif.type} userId={notif.user} commentId={notif.comment} postId={notif.post} topicId={notif.topic} />
                    )
                  }
                </div>
              </div>
              <div className="navbar-profile-menu flex-center">
                <input className="navbar-profile-checkbox hidden-checkbox" id="navbar-profile-checkbox" type="checkbox" />
                <label htmlFor="navbar-profile-checkbox" className="navbar-profile-button">
                  <Avatar bgImg={currentUser.avatar.bgImg} bgColor={currentUser.avatar.bgColor} baseColor={currentUser.avatar.baseColor} accImg={currentUser.avatar.accImg} accColor={currentUser.avatar.accColor} width={60} />
                </label>
                <div className="navbar-profile-dropdown-container">
                  <div className="navbar-profile-dropdown-profile-info flex-column">
                    <h1>{currentUser.username}</h1>
                    <Avatar bgImg={currentUser.avatar.bgImg} bgColor={currentUser.avatar.bgColor} baseColor={currentUser.avatar.baseColor} accImg={currentUser.avatar.accImg} accColor={currentUser.avatar.accColor} width={150} />
                    <Link className="navbar-profile-dropdown-edit-profile-link flex-center"><i className='bx bx-edit'></i></Link>
                  </div>
                  <br></br>
                  <div className="split-line"></div>
                  <Link to={"/user/"+currentUser.id} className="navbar-profile-dropdown-link">Activity</Link>
                  <Link to="/saved" className="navbar-profile-dropdown-link">Saved</Link>
                  <div className="split-line"></div>
                  <br></br>
                  <button className="navbar-button" onClick={LogOut}>Log Out</button>
                  <br></br>
                </div>
              </div>
              </div> 
            : <div className="navbar-options flex-row">
                <Link to="/register" className="navbar-button">Register</Link>
                <Link to="/login" className="navbar-button">Log In</Link>
              </div>
            
          }
        </header>
    );

}

export default Header;