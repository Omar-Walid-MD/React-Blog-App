
import {Link} from "react-router-dom";

function Header()
{
    return (
        <header className="navbar flex-row">
            <div>
              <Link to="/" className="navbar-logo">BLOG APP</Link>
            </div>
            <div className="navbar-options flex-row">
              <p>LINK</p>
              <p>LINK</p>
            </div>
          </header>
    );

}

export default Header;