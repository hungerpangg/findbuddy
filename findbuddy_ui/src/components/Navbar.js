import {Link,NavLink} from 'react-router-dom';

function Navbar(){
    return(
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link to="/" className="navbar-brand">
          My App
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <NavLink to="/signin" className="nav-link">
                Sign in
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/signup" className="nav-link">
                Sign up
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    )
}

export default Navbar;