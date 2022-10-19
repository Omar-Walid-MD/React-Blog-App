
import { useEffect, useState } from "react";
import {Link} from "react-router-dom";

function Header({currentUser, setCurrentUser})
{

  function LogOut(e)
  {

    setCurrentUser(null);
    localStorage.setItem('currentUser', JSON.stringify(null));

    window.location.reload();
    
  }

  useEffect(()=>{
    // console.log(currentUser)
  },[])

    return (
        <header className="navbar flex-row">
            <div>
              <Link to="/" className="navbar-logo">BLOG APP</Link>
            </div>
            {
              currentUser ? 
              <div className="navbar-options-loggedin flex-row">
                <div className="navbar-profile-menu flex-center">
                  <input className="navbar-profile-checkbox" id="navbar-profile-checkbox" type="checkbox" />
                  <label htmlFor="navbar-profile-checkbox" className="navbar-profile-button flex-center"><img className="navbar-profile-icon" src={require("./img/profile-icon.png")} /></label>
                  <div className="navbar-profile-dropdown-container">
                    <h1>{currentUser.username}</h1>
                    <div className="split-line"></div>
                    <Link to="/activity" className="navbar-profile-dropdown-link">Activity</Link>
                    <Link className="navbar-profile-dropdown-link">Saved posts</Link>
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