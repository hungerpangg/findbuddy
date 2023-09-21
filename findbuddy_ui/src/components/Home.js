import { useState, useEffect, useContext, useRef } from "react";
import AuthenticateContext from "../context/authenticate";
import Match from "./Match";
import { FaSearch } from "react-icons/fa";
import * as bootstrap from "bootstrap";
// window.bootstrap = bootstrap;

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
			console.log(data);
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
			console.log(data);
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

	// const updateUser = async () => {
	// 	const acceptedBuddies = acceptedBuddiesRef.current;
	// 	const rejectedBuddies = rejectedBuddiesRef.current;
	// 	try {
	// 		const res = await fetch(`http://localhost:4000/updateuserbuddies`, {
	// 			method: "POST",
	// 			body: JSON.stringify({ userId, rejectedBuddies, acceptedBuddies }),
	// 			headers: { "Content-Type": "application/json" },
	// 			credentials: "include",
	// 		});
	// 		console.log("updateUser ran!", res);
	// 		if (res.status === 200) {
	// 			const data = await res.json();
	// 			console.log(data, "update user returned");
	// 			return;
	// 		}
	// 	} catch (err) {
	// 		console.log(err);
	// 	}
	// };

	const addBuddy = () => {
		var fetchState = false;
		console.log("i ran");
		if (state.listOfProfiles.length <= 1) {
			console.log("i ran");
			fetchState = true;
		}
		var newList = state.listOfProfiles;
		newList.shift();
		var newAcceptedBuddies = state.acceptedBuddies;
		newAcceptedBuddies.push(state.currentProfile);
		// await updateUser();
		// console.log("update user done");
		console.log(state.currentProfile.email, email, secret);
		try {
			var raw = {
				usernames: [state.currentProfile.email],
				is_direct_chat: true,
			};

			var requestOptions = {
				method: "Put",
				headers: {
					"Project-ID": "00b0b622-9275-438f-9de0-2d9dff028a21",
					"User-Name": email,
					"User-Secret": secret,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(raw),
			};

			fetch("https://api.chatengine.io/chats/", requestOptions)
				.then((response) => response.text())
				.then((result) => console.log(result))
				.catch((error) => console.log("error", error));
		} catch (err) {
			console.log(err, "create chat error");
		}
		setState((prevState) => ({
			...prevState,
			currentProfile: newList[0],
			listOfProfiles: newList,
			acceptedBuddies: newAcceptedBuddies,
			fetchState,
		}));
	};

	const rejectBuddy = () => {
		var fetch = false;
		console.log("i ran");
		if (state.listOfProfiles.length <= 1) {
			console.log("i ran");
			fetch = true;
		}
		var newList = state.listOfProfiles;
		newList.shift();
		var newRejectedBuddies = state.rejectedBuddies;
		newRejectedBuddies.push(state.currentProfile);
		setState((prevState) => ({
			...prevState,
			currentProfile: newList[0],
			listOfProfiles: newList,
			rejectedBuddies: newRejectedBuddies,
			fetch,
		}));
	};

	const handleSearchChange = (e) => {
		setState((prevState) => ({
			...prevState,
			searchValue: e.target.value,
		}));
	};

	const handleSearchSubmit = async () => {
		try {
			const res = await fetch(`http://localhost:4000/getsearchedusers`, {
				method: "POST",
				body: JSON.stringify({ searchValue: state.searchValue, userId }),
				headers: { "Content-Type": "application/json" },
				credentials: "include",
			});
			const { data } = await res.json();
			// console.log(data);
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

	useEffect(() => {
		// setTimeout(getProfiles, 500);
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

	// const handleAdd = () => {
	// 	var myHeaders = new Headers();
	// 	myHeaders.append("Project-ID", "{{project_id}}");
	// 	myHeaders.append("User-Name", "{{user_name}}");
	// 	myHeaders.append("User-Secret", "{{user_secret}}");

	// 	var requestOptions = {
	// 		method: "GET",
	// 		headers: myHeaders,
	// 		redirect: "follow",
	// 	};

	// 	fetch(
	// 		"https://api.chatengine.io/chats/latest/{{chat_count}}/",
	// 		requestOptions
	// 	)
	// 		.then((response) => response.text())
	// 		.then((result) => console.log(result))
	// 		.catch((error) => console.log("error", error));
	// };

	console.log(state, "state", acceptedBuddiesRef.current, "useref");

	return (
		<div className="d-flex flex-column justify-content-center">
			{/* {state.currentUser?.name ? (
				<Match matchedUser={state.previousProfile} />
			) : (
				""
			)} */}
			<div className="input-group d-flex justify-content-center mt-5">
				<div className="form-outline">
					<input
						type="search"
						id="form1"
						className="form-control"
						placeholder="Search"
						onChange={handleSearchChange}
						value={state.searchValue}
					/>
					{/* <label className="form-label" for="form1">
						Search
					</label> */}
				</div>
				<button
					type="button"
					className="btn btn-primary"
					onClick={handleSearchSubmit}
				>
					{/* <i className="fas fa-search"></i> */}
					<FaSearch />
				</button>
			</div>
			<Match matchedUser={state.previousProfile} hideModal={hideModal} />
			<div className="container d-flex flex-row align-items-center justify-content-center">
				<button onClick={handleLike}>Like!</button>
				<div className="card mx-3 mx-sm-5" style={{ width: "20rem" }}>
					<h5 className="card-title" style={{ margin: "1em auto" }}>
						{state.currentProfile?.name}
					</h5>
					<div
						id="carouselExampleIndicators"
						className="carousel slide"
						data-ride="carousel"
					>
						<ol class="carousel-indicators">
							{/* <li
								data-bs-target="#carouselExampleIndicators"
								data-bs-slide-to="0"
								className="active"
							></li>
							<li
								data-bs-target="#carouselExampleIndicators"
								data-bs-slide-to="1"
							></li>
							<li
								data-bs-target="#carouselExampleIndicators"
								data-bs-slide-to="2"
							></li> */}
							{renderedIndicators}
						</ol>
						<div className="carousel-inner">
							{/* <div class="carousel-item active">
								<img class="d-block w-100" src={images[0]} alt="First slide" />
							</div>
							<div class="carousel-item">
								<img class="d-block w-100" src={images[1]} alt="Second slide" />
							</div>
							<div class="carousel-item">
								<img class="d-block w-100" src={images[2]} alt="Third slide" />
							</div> */}
							{renderedImages}
						</div>
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

				{/* <div
					className="nav-link"
					data-bs-toggle="modal"
					data-bs-target="#exampleModal2"
					style={{ cursor: "pointer" }}
				>
					OpenModal
				</div> */}
				<button onClick={handleReject}>Reject!</button>
			</div>
		</div>
	);
}

export default Home;
