import { useState, useEffect, useContext, useRef } from "react";
import AuthenticateContext from "../context/authenticate";
import Match from "./Match";
import { FaSearch } from "react-icons/fa";
import { GoCircleSlash } from "react-icons/go";
import * as bootstrap from "bootstrap";

function Home() {
	const noProfilePicture =
		"https://findbuddy-pictures.s3.ap-southeast-1.amazonaws.com/no-profile-picture.jpeg";
	const {
		authenticatedState: { userId, email, secret },
	} = useContext(AuthenticateContext);
	const [imageIndex, setImageIndex] = useState(0);
	const [state, setState] = useState({
		searchValue: "",
		previousProfile: {},
		currentProfile: {},
		listOfProfiles: [],
		fetch: false,
	});

	const handleModal = () => {
		const myModal = document.getElementById("exampleModal2");
		const bootstrapModal = new bootstrap.Modal(myModal);
		bootstrapModal.show();
	};

	const hideModal = () => {
		const myModal = document.getElementById("exampleModal2");
		const bootstrapModal = new bootstrap.Modal(myModal);
		bootstrapModal.hide();
	};

	const acceptedBuddiesRef = useRef();
	acceptedBuddiesRef.current = state.acceptedBuddies;
	const rejectedBuddiesRef = useRef();
	rejectedBuddiesRef.current = state.rejectedBuddies;
	const currentSearchedValue = useRef();
	if (!currentSearchedValue.current) currentSearchedValue.current = "";

	const handleNextProfileAction = () => {
		// handle frontend
		var fetchState = false;
		if (state.listOfProfiles.length <= 1) {
			fetchState = true;
		}
		var newList = state.listOfProfiles;
		var previousProfile = newList.shift();
		setState((prevState) => ({
			...prevState,
			previousProfile,
			currentProfile: newList[0],
			listOfProfiles: newList,
			fetch: fetchState,
		}));
	};

	const handleLike = async () => {
		handleNextProfileAction();
		try {
			const res = await fetch(`http://localhost:4000/like`, {
				method: "POST",
				body: JSON.stringify({
					senderId: userId,
					receiverId: state.currentProfile?._id,
					senderEmail: email,
					receiverEmail: state.currentProfile.email,
				}),
				headers: { "Content-Type": "application/json" },
				credentials: "include",
			});
			const data = await res.json();
			if (data.mutual) {
				handleModal();
			}
		} catch (err) {
			console.log(err);
		}
	};

	const handleReject = async () => {
		handleNextProfileAction();
		try {
			const res = await fetch(`http://localhost:4000/rejection`, {
				method: "POST",
				body: JSON.stringify({
					senderId: userId,
					receiverId: state.currentProfile?._id,
				}),
				headers: { "Content-Type": "application/json" },
				credentials: "include",
			});
			const data = await res.json();
		} catch (err) {
			console.log(err);
		}
	};

	const getProfiles = async () => {
		try {
			const res = await fetch(`http://localhost:4000/getusers`, {
				method: "POST",
				body: JSON.stringify({ userId }),
				headers: { "Content-Type": "application/json" },
				credentials: "include",
			});
			const data = await res.json();
			setState((prevState) => ({
				...prevState,
				listOfProfiles: data,
				currentProfile: data[0],
				fetch: false,
			}));
		} catch (err) {
			console.log(err);
		}
	};

	const handleSearchChange = (e) => {
		setState((prevState) => ({
			...prevState,
			searchValue: e.target.value,
		}));
	};

	const handleSearchSubmit = async (event) => {
		if (event.key === "Enter" || event.type === "click")
			try {
				const res = await fetch(`http://localhost:4000/getsearchedusers`, {
					method: "POST",
					body: JSON.stringify({ searchValue: state.searchValue, userId }),
					headers: { "Content-Type": "application/json" },
					credentials: "include",
				});
				const { data } = await res.json();
				currentSearchedValue.current = state.searchValue;
				setState((prevState) => ({
					...prevState,
					listOfProfiles: data,
					currentProfile: data[0],
					fetch: false,
				}));
			} catch (err) {
				console.log(err);
			}
	};

	const handleClearFilter = () => {
		currentSearchedValue.current = "";
		setState((prevState) => ({
			...prevState,
			searchValue: "",
			fetch: true,
		}));
	};

	useEffect(() => {
		getProfiles();
	}, [state.fetch, userId]);

	var renderedImages = [];
	var renderedIndicators = [];
	if (state.currentProfile?.pictureUrls?.length > 0) {
		renderedImages = state.currentProfile?.pictureUrls.map((url, index) => {
			return (
				<div class={`carousel-item ${index === 0 && "active"}`}>
					<img class="d-block w-100" src={url} alt="First slide" />
				</div>
			);
		});
		renderedIndicators = state.currentProfile?.pictureUrls.map((url, index) => {
			return (
				<li
					data-bs-target="#carouselExampleIndicators"
					data-bs-slide-to={index}
					className={`${index === 0 && "active"}`}
				></li>
			);
		});
	} else {
		renderedImages = (
			<div class="carousel-item active">
				<img class="d-block w-100" src={noProfilePicture} alt="First slide" />
			</div>
		);
	}

	return (
		<div className="d-flex flex-column justify-content-center">
			<div className="input-group d-flex justify-content-center mt-5">
				<div className="form-outline">
					<input
						type="search"
						id="form1"
						className="form-control"
						placeholder="Search"
						onKeyUp={handleSearchSubmit}
						onChange={handleSearchChange}
						value={state.searchValue}
					/>
				</div>
				<button
					type="button"
					className="btn btn-primary"
					onClick={handleSearchSubmit}
				>
					<FaSearch />
				</button>
				<button
					type="button"
					className="btn btn-secondary"
					onClick={handleClearFilter}
				>
					<GoCircleSlash />
				</button>
			</div>
			<div style={{ margin: "1em auto 0 auto" }}>
				{currentSearchedValue.current.length > 0 &&
					`Currently searching for: ${currentSearchedValue.current}`}
			</div>
			<Match matchedUser={state.previousProfile} hideModal={hideModal} />
			<div className="container d-flex flex-row align-items-center justify-content-center">
				<button onClick={handleReject} className="btn btn-warning">
					Pass!
				</button>
				<div className="card mx-3 mx-sm-5" style={{ width: "20rem" }}>
					<h5 className="card-title" style={{ margin: "1em auto" }}>
						{state.currentProfile?.name}
					</h5>
					<div
						id="carouselExampleIndicators"
						className="carousel slide"
						data-ride="carousel"
					>
						<ol class="carousel-indicators">{renderedIndicators}</ol>
						<div className="carousel-inner">{renderedImages}</div>
						{state.currentProfile?.pictureUrls?.length > 0 && (
							<a
								className="carousel-control-prev"
								href="#carouselExampleIndicators"
								role="button"
								data-bs-slide="prev"
							>
								<span
									class="carousel-control-prev-icon"
									aria-hidden="true"
								></span>
								<span class="sr-only">Previous</span>
							</a>
						)}
						{state.currentProfile?.pictureUrls?.length > 0 && (
							<a
								className="carousel-control-next"
								href="#carouselExampleIndicators"
								role="button"
								data-bs-slide="next"
							>
								<span
									className="carousel-control-next-icon"
									aria-hidden="true"
								></span>
								<span className="sr-only">Next</span>
							</a>
						)}
					</div>
					<div className="card-body">
						<p className="card-text">
							<span
								style={{
									textAlign: "start",
									fontWeight: "bold",
									display: "block",
								}}
							>
								Looking for
							</span>
							{state.currentProfile?.lookingFor}
						</p>
						<p className="card-text">
							<span
								style={{
									textAlign: "start",
									fontWeight: "bold",
									display: "block",
								}}
							>
								Description
							</span>
							{state.currentProfile?.description}
						</p>
						<ul className="list-group list-group-flush">
							{state.currentProfile?.country?.length > 0 && (
								<li className="list-group-item">
									Country: {state.currentProfile?.country}
								</li>
							)}
							{typeof state.currentProfile?.age === "number" && (
								<li className="list-group-item">
									Age: {state.currentProfile?.age}
								</li>
							)}
							{state.currentProfile?.occupation?.length > 0 && (
								<li className="list-group-item">
									Occupation: {state.currentProfile?.occupation}
								</li>
							)}
						</ul>
					</div>
				</div>

				<button onClick={handleLike} className="btn btn-success">
					Like!
				</button>
			</div>
		</div>
	);
}

export default Home;
