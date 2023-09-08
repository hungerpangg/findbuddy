import { Link, NavLink } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import Signout from "./Signout";
import AuthenticateContext from "../context/authenticate";

function SignedInNavbar() {
	const {
		authenticatedState: { userId },
	} = useContext(AuthenticateContext);

	// useEffect(() => {
	// 	fetch("http://localhost:4000/authenticateChat", {
	// 		method: "POST",
	// 		body: JSON.stringify({ userId }),
	// 		headers: { "Content-Type": "application/json" },
	// 	})
	// 		.then((res) => {
	// 			return res.json();
	// 		})
	// 		.then((data) => {
	// 			const { username, secret } = data.data;
	// 			setAuthenticatedState((prevState) => {
	// 				return {
	// 					...prevState,
	// 					secret,
	// 				};
	// 			});
	// 		})
	// 		.catch((err) => console.log(err));
	// }, []);

	return (
		<nav className="navbar navbar-expand-sm navbar-light bg-light">
			<div className="container">
				<Link to="/home" className="navbar-brand">
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
								<NavLink to="/chats" className="nav-link">
									Chats
								</NavLink>
							</li>
							<li className="nav-item">
								<NavLink to="/friends" className="nav-link">
									Friends
								</NavLink>
							</li>
						</ul>
					</div>
					<div className="dropdown position-relative ml-auto">
						<button
							class="btn btn-secondary dropdown-toggle"
							type="button"
							id="dropdownMenuButton"
							data-bs-toggle="dropdown"
							aria-haspopup="true"
							aria-expanded="false"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								class="bi bi-person"
								viewBox="0 0 16 16"
							>
								<path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
							</svg>
						</button>

						<div class="dropdown-menu dropdown-menu-right">
							<ul
								className="container navbar-nav ml-auto d-flex flex-column pl-3"
								// style={{ display: "flex", "flex-direction": "column" }}
							>
								<li className="nav-item">
									<NavLink to={`/profile/${userId}`} className="nav-link">
										Profile
									</NavLink>
								</li>
								<li>
									<div
										className="nav-link"
										data-bs-toggle="modal"
										data-bs-target="#exampleModal"
										style={{ cursor: "pointer" }}
									>
										Sign out
									</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
}

export default SignedInNavbar;
