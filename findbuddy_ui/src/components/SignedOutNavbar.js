import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import Signout from "./Signout";

function SignedInNavbar() {
	return (
		<nav className="navbar navbar-expand-sm navbar-light bg-light">
			<div className="container">
				<Link to="/" className="navbar-brand">
					My App
				</Link>
				<div className="d-flex align-items-end justify-content-end">
					<Signout />
					{/* <button
						className="navbar-toggler"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#navbarNav"
						aria-controls="navbarNav"
						aria-expanded="false"
						aria-label="Toggle navigation"
					>
						<span className="navbar-toggler-icon" />
					</button> */}
					{/* <div className="d-flex align-items-end justify-content-end"> */}
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
