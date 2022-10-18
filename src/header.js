
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
                  <h3>Welcome, {currentUser.username}</h3>
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