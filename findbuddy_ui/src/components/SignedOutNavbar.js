import { Link, NavLink, useLocation } from "react-router-dom";
import Signout from "./Signout";

function SignedInNavbar() {
	const location = useLocation();
	const currentPath = location.pathname;
	console.log(currentPath, "currentPath");

	return (
		<nav className="navbar navbar-expand-sm navbar-light bg-light">
			<div className="container">
				<Link to="/" className="navbar-brand">
					FindBuddy
				</Link>
				<div className="d-flex align-items-end justify-content-end">
					<Signout />

					<div className="navbar-links mr-4" id="navbarNav">
						<ul
							className="navbar-nav ml-auto d-flex flex-row"
							style={{ gap: "10px" }}
						>
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
			</div>
		</nav>
	);
}

export default SignedInNavbar;
