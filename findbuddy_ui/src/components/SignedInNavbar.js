import { Link, NavLink } from "react-router-dom";
import { useRef, useContext, useEffect, useState } from "react";
import Signout from "./Signout";
import AuthenticateContext from "../context/authenticate";
import * as bootstrap from "bootstrap";
// window.bootstrap = bootstrap;

function SignedInNavbar() {
	const {
		authenticatedState: { userId },
	} = useContext(AuthenticateContext);

	const dropdownRef = useRef(null);

	useEffect(() => {
		const dropdownToggle = dropdownRef.current;

		if (dropdownToggle) {
			// Create a Bootstrap Dropdown instance
			const dropdown = new bootstrap.Dropdown(dropdownToggle);

			console.log(dropdownToggle);

			const handleShow = () => {
				if (dropdownToggle.ariaExpanded === "false") {
					dropdown.show();
					dropdownToggle.ariaExpanded = "true";
				} else {
					dropdown.hide();
					dropdownToggle.ariaExpanded = "false";
				}
			};

			// Function to handle clicks outside the dropdown
			const handleOutsideClick = (event) => {
				if (!dropdownToggle.contains(event.target)) {
					// If the click is outside the dropdown, close it
					dropdown.hide();
					dropdownToggle.ariaExpanded = "false";
				}
			};

			// Add a click event listener to the document
			dropdownToggle.addEventListener("click", handleShow);
			document.addEventListener("click", handleOutsideClick);

			// Cleanup function: Remove the event listener when the component unmounts
			return () => {
				document.removeEventListener("click", handleOutsideClick);
				document.removeEventListener("click", handleShow);
			};
		}
	}, [userId]);

	return (
		<nav className="navbar navbar-expand-sm navbar-light bg-light">
			<div className="container">
				<Link to="/home" className="navbar-brand">
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
								<NavLink to="/chats" className="nav-link">
									Chats
								</NavLink>
							</li>
							{/* <li className="nav-item">
								<NavLink to="/friends" className="nav-link">
									Friends
								</NavLink>
							</li> */}
						</ul>
					</div>
					<div className="dropdown position-relative ml-auto">
						<button
							ref={dropdownRef}
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
