
import { useState } from "react";
import {Link} from "react-router-dom";

function Header()
{

    return (
        <header className="navbar flex-row">
            <div>
              <Link to="/" className="navbar-logo">BLOG APP</Link>
            </div>
            <div className="navbar-options flex-row">
              <Link to="/register" className="navbar-button">Register</Link>
              <Link className="navbar-button">Log In</Link>
            </div>
          </header>
    );

}

export default Header;