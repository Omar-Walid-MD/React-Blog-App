
import { useEffect, useState } from "react";
import {Link} from "react-router-dom";

function Header({topics, currentUser, setCurrentUser})
{

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

  function LogOut(e)
  {

    setCurrentUser(null);
    localStorage.setItem('currentUser', JSON.stringify(null));

    window.location.reload();
    
  }

  useEffect(()=>{
    setSearchValue("");
  },[])

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

                          GetSearchResults(searchValue).map((searchResult)=>
                          <Link to={"/topic/"+searchResult.id} className="topic-result-container flex-column">
                            <h2 className="topic-result-title">{searchResult.title}</h2>
                            <p className="topic-result-members">{searchResult.members} Members</p>
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
              <div className="navbar-profile-menu flex-center">
                <input className="navbar-profile-checkbox hidden-checkbox" id="navbar-profile-checkbox" type="checkbox" />
                <label htmlFor="navbar-profile-checkbox" className="navbar-profile-button flex-center"><img className="navbar-profile-icon" src={require("./img/profile-icon.png")} /></label>
                <div className="navbar-profile-dropdown-container">
                  <h1>{currentUser.username}</h1>
                  <div className="split-line"></div>
                  <Link to="/activity" className="navbar-profile-dropdown-link">Activity</Link>
                  <Link to="/saved" className="navbar-profile-dropdown-link">Saved</Link>
                </div>
              </div>
                <button className="navbar-button" onClick={LogOut}>Log Out</button>
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