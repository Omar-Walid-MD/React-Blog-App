
import { useEffect, useRef, useState } from "react";
import { useNavigate, Link, useLocation} from "react-router-dom";
import { useTranslation } from "react-i18next";

import Avatar from "./Avatar";
import Notif from "./Notif";
import axios from 'axios';

import TopicLogo from "./TopicLogo";

function Navbar({topics, currentUser, setCurrentUser})
{
  const [tr,il8n] = useTranslation();

  const navigate = useNavigate();

  const imgPath = "../img/topic-logo";

  let location = useLocation();

  const [searchValue,setSearchValue] = useState("");

  const profileCheckbox = useRef();
  const notifCheckbox = useRef();

  function handleSearchValue(event)
  {
    setSearchValue(event.target.value);
    console.log(searchValue);
  }

  function GetSearchResults(searchValue)
  {
    return topics.filter((topic)=>topic.title.toLowerCase().includes(searchValue.toLowerCase()));
  }

  function HandleWindows(event)
  {
    console.log(event.currentTarget.htmlFor)
    if(event.currentTarget.htmlFor==="navbar-notif-checkbox")
    {
      if(profileCheckbox.current.checked) profileCheckbox.current.checked = false;
    }
    else if(event.currentTarget.htmlFor==="navbar-profile-checkbox")
    {
      if(notifCheckbox.current.checked) notifCheckbox.current.checked = false;
    }
    

  }

  function GetNofitications(currentUser)
  {
    console.log(currentUser.notifs);
    return currentUser.notifs.slice().reverse();
  }

  function NewNotifCount(currentUser)
  {
    let s = currentUser.notifs.filter((notif)=>notif.state==="new").length;
    console.log("s: " + s);
    return s>9 ? "9+" : s;
  }

  function SetNotifSeen(currentUser)
  {
    if(currentUser.notifs.some(function(notif){return notif.state==="new"}))
    {
      let updatedUser = {
        ...currentUser,
        notifs: currentUser.notifs.map((notif) => notif.state==="new" ? {...notif,state:"seen"} : notif)
      }

      axios.put('http://localhost:8000/users/'+updatedUser.id,
        updatedUser
      )
      .then(resp =>{
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          setCurrentUser(updatedUser);
      }).catch(error => {
          console.log(error);
      });

    }
  }

  function SetNotifRead(currentUser,notif)
  {
    if(notif.state!=="read")
    {
      let updatedUser = {
        ...currentUser,
        notifs: currentUser.notifs.map((notifInList) => notifInList.id===notif.id ? {...notif,state:"read"} : notifInList)
      }

      axios.put('http://localhost:8000/users/'+updatedUser.id,
        updatedUser
      )
      .then(resp =>{
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          setCurrentUser(updatedUser);
      }).catch(error => {
          console.log(error);
      });
    }
  }

  function SetAllNotifRead(currentUser)
  {
    currentUser.notifs.forEach(notif => {
      SetNotifRead(currentUser,notif)
    });
  }

  function ClearAllNotif(currentUser)
  {
    let updatedUser = {
      ...currentUser,
      notifs: []
    };

    axios.put('http://localhost:8000/users/'+updatedUser.id,
      updatedUser
    )
    .then(resp =>{
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
    }).catch(error => {
        console.log(error);
    });
  }

  function LogOut(e)
  {
    setCurrentUser(null);
    localStorage.setItem('currentUser', JSON.stringify(null));

    if(location.pathname==="/new-topic"||location.pathname==="/write")
    {
      navigate("/")
    }
    else
    {
      window.location.reload();
    }
    
  }

  useEffect(()=>{
    setSearchValue("");
    console.log("oops");
  },[location]);

    return (
        <header className="navbar flex-row">
            <Link to="/" className="navbar-logo">BLOGGEST</Link>
            <div className="navbar-search-container flex-center">
              <input className="navbar-search-input" type="search" placeholder={tr("header.searchForTopics")} value={searchValue} onChange={handleSearchValue} />          
                  {
                    searchValue!=="" &&
                    <div className="navbar-search-dropdown">
                      <div className="navbar-search-results">
                        {
                          GetSearchResults(searchValue).length > 0 ?

                          GetSearchResults(searchValue).map((topic)=>
                            <Link to={"/topic/"+topic.id} className="topic-result-container flex-row" key={topic.id}>
                            <div className="topic-result-logo flex-center">
                              <TopicLogo topicLogo={topic.logo} width={100} />
                            </div>
                            <div className="topic-result-info">
                              <h2 className="topic-result-title">{topic.title}</h2>
                              <p className="topic-result-members">{topic.members} {tr("mainPage.members")}</p>
                            </div>
                          </Link>
                          )
                          : <h1 className="topic-results-empty">{tr("header.noResults")} "{searchValue}"</h1>
                        }
                      </div>
                      <div className="navbar-create-topic-tab-container">
                        {
                          currentUser ?
                          <Link to={"/new-topic"} className="navbar-create-topic-link flex-row"><div className="navbar-create-topic-circle flex-center"><i className='bx bx-plus-medical add-icon'></i></div>{tr("header.createTopic")}</Link>
                          : <div>{tr("header.mustBeLoggedIn")}</div>
                        }
                      </div>
                  </div>
                  }
                
              </div>
          {
            currentUser ? 
            <div className="navbar-options flex-row">
              <div className="navbar-notif-menu flex-center">
                <input type="checkbox" className="navbar-notif-checkbox hidden-checkbox" id="navbar-notif-checkbox" ref={notifCheckbox}/>
                <label htmlFor="navbar-notif-checkbox" className="navbar-notif-button" onClick={function(event){HandleWindows(event);if(!notifCheckbox.current.checked) SetNotifSeen(currentUser)}}>
                  <i className={"bx " + (NewNotifCount(currentUser) > 0 ? "bxs-bell" : "bx-bell")}></i>
                  {
                    NewNotifCount(currentUser) > 0 &&
                    <div className="notification-bell-label flex-center">{NewNotifCount(currentUser)}</div>
                  }
                </label>
                <div className="navbar-notif-dropdown-container" empty={GetNofitications(currentUser).length > 0 ? "false" : "true"}>
                  {
                    GetNofitications(currentUser).length > 0 ?
                    <div className="navbar-notif-dropdown-notifs">
                      {
                        GetNofitications(currentUser).map((notif,index)=>
                        <Notif notif={notif} key={"notif-"+index} currentUser={currentUser} setRead={SetNotifRead} />
                        )
                      }
                    </div>
                    :
                    <div className="navbar-notif-dropdown-empty flex-column">
                      <h1>{tr("header.noNotifs")}</h1>
                      <div className="empty-notif-img"></div>
                    </div>
                    
                  }
                  {
                    GetNofitications(currentUser).length > 0 &&
                    <div className="navbar-notif-dropdown-bottom flex-row">
                      <button className="navbar-notif-dropdown-bottom-button" onClick={function(){ClearAllNotif(currentUser)}}>{tr("header.clearAll")}</button>
                      {
                        GetNofitications(currentUser).some((notif)=>{return notif.state==="read"}).length > 0 &&
                        <button className="navbar-notif-dropdown-bottom-button" onClick={function(){SetAllNotifRead(currentUser)}}>{tr("header.markAllRead")}</button>
                      }
                    </div>
                  }
                </div>
              </div>
              <div className="navbar-profile-menu flex-center">
                <input className="navbar-profile-checkbox hidden-checkbox" id="navbar-profile-checkbox" type="checkbox" ref={profileCheckbox}/>
                <label htmlFor="navbar-profile-checkbox" className="navbar-profile-button flex-center" onClick={HandleWindows}>
                  <Avatar bgImg={currentUser.avatar.bgImg} bgColor={currentUser.avatar.bgColor} baseColor={currentUser.avatar.baseColor} accImg={currentUser.avatar.accImg} accColor={currentUser.avatar.accColor} width={60} />
                </label>
                <div className="navbar-profile-dropdown-container flex-column">
                  <div className="navbar-profile-dropdown-profile-info flex-column">
                    <h1 className="navbar-profile-username">{currentUser.username}</h1>
                    <div className="navbar-profile-avatar flex-center">
                      <Avatar bgImg={currentUser.avatar.bgImg} bgColor={currentUser.avatar.bgColor} baseColor={currentUser.avatar.baseColor} accImg={currentUser.avatar.accImg} accColor={currentUser.avatar.accColor} width={150} />
                    </div>
                    <Link to="/edit-profile" className="navbar-profile-dropdown-edit-profile-link flex-center"><i className='bx bx-edit'></i></Link>
                  </div>
                  <br></br>
                  <div className="split-line"></div>
                  <Link to={"/user/"+currentUser.id} className="navbar-profile-dropdown-link">{tr("header.activity")}</Link>
                  <Link to="/saved" className="navbar-profile-dropdown-link">{tr("header.saved")}</Link>
                  <div className="split-line"></div>
                  <br></br>
                  <button className="button navbar-button" onClick={LogOut}>{tr("header.logOut")}</button>
                  <br></br>
                </div>
              </div>
              </div> 
            : <div className="navbar-options flex-row">
                <Link to="/register" state={{prevPath: location.pathname}} className="button navbar-button">{tr("header.register")}</Link>
                <Link to="/login" state={{prevPath: location.pathname}} className="button navbar-button">{tr("header.logIn")}</Link>
              </div>
            
          }
        </header>
    );

}

export default Navbar;