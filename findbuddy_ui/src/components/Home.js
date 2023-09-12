import { current } from "immer";
import { useState, useEffect, useContext, useRef } from "react";
import AuthenticateContext from "../context/authenticate";

function Home() {
	const noProfilePicture =
		"https://findbuddy-pictures.s3.ap-southeast-1.amazonaws.com/no-profile-picture.jpeg";
	const {
		authenticatedState: { userId },
	} = useContext(AuthenticateContext);
	const [imageIndex, setImageIndex] = useState(0);
	const [state, setState] = useState({
		name: "",
		country: "",
		occupation: "",
		age: "",
		lookingFor: "",
		description: "",
		pictureUrls: [],
		currentProfile: {},
		listOfProfiles: [],
		acceptedBuddies: [],
		rejectedBuddies: [],
		fetch: false,
	});

	const acceptedBuddiesRef = useRef();
	acceptedBuddiesRef.current = state.acceptedBuddies;
	const rejectedBuddiesRef = useRef();
	rejectedBuddiesRef.current = state.rejectedBuddies;

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
				acceptedBuddies: [],
				rejectedBuddies: [],
				listOfProfiles: data,
				currentProfile: data[0],
				fetch: false,
			}));
			// console.log(data);
		} catch (err) {
			console.log(err);
		}
	};

	const updateUser = async () => {
		// const rejectedBuddies = [
		// 	"64c93893bfef3bf21f08e315",
		// 	"64cbd99c0a2f35752a0d0bac",
		// ];
		// const acceptedBuddies = [
		// 	"64ef0847f740862d5abea120",
		// 	"64ef08f6f740862d5abea128",
		// ];
		const acceptedBuddies = acceptedBuddiesRef.current;
		const rejectedBuddies = rejectedBuddiesRef.current;
		// console.log(acceptedBuddies, "accepetedBuddies in updateuser");
		try {
			const res = await fetch(`http://localhost:4000/updateuserbuddies`, {
				method: "POST",
				body: JSON.stringify({ userId, rejectedBuddies, acceptedBuddies }),
				headers: { "Content-Type": "application/json" },
				credentials: "include",
			});
			console.log("updateUser ran!", res);
			if (res.status === 200) {
				const data = await res.json();
				console.log(data, "update user returned");
				return;
			}
			// setState((prevState) => ({
			// 	...prevState,
			// }));
		} catch (err) {
			console.log(err);
		}
	};

	const addBuddy = () => {
		var fetch = false;
		console.log("i ran");
		if (state.listOfProfiles.length <= 1) {
			console.log("i ran");
			fetch = true;
		}
		var newList = state.listOfProfiles;
		newList.shift();
		var newAcceptedBuddies = state.acceptedBuddies;
		newAcceptedBuddies.push(state.currentProfile);
		// await updateUser();
		// console.log("update user done");
		setState((prevState) => ({
			...prevState,
			currentProfile: newList[0],
			listOfProfiles: newList,
			acceptedBuddies: newAcceptedBuddies,
			fetch,
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

	useEffect(() => {
		// setTimeout(getProfiles, 500);
		getProfiles();
		window.addEventListener("beforeunload", updateUser);
		return () => {
			window.removeEventListener("beforeunload", updateUser);
			updateUser();
		};
	}, [state.fetch]);

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
		<div>
			<div class="container d-flex flex-row align-items-center justify-content-center">
				<div>
					<button onClick={addBuddy}>Add</button>
				</div>
				<div class="card" style={{ width: "20rem", margin: "2em 3em" }}>
					<h5 class="card-title" style={{ margin: "1em auto" }}>
						{state.currentProfile?.name}
					</h5>
					<div
						id="carouselExampleIndicators"
						class="carousel slide"
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
						<div class="carousel-inner">
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
								class="carousel-control-prev"
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
								class="carousel-control-next"
								href="#carouselExampleIndicators"
								role="button"
								data-bs-slide="next"
							>
								<span
									class="carousel-control-next-icon"
									aria-hidden="true"
								></span>
								<span class="sr-only">Next</span>
							</a>
						)}
					</div>
					<div class="card-body">
						<p class="card-text">
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
						<p class="card-text">
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
						<ul class="list-group list-group-flush">
							{state.currentProfile?.country?.length > 0 && (
								<li class="list-group-item">
									Country: {state.currentProfile?.country}
								</li>
							)}
							{typeof state.currentProfile?.age === "number" && (
								<li class="list-group-item">
									Age: {state.currentProfile?.age}
								</li>
							)}
							{state.currentProfile?.occupation?.length > 0 && (
								<li class="list-group-item">
									Occupation: {state.currentProfile?.occupation}
								</li>
							)}
						</ul>
					</div>
				</div>
				<div>
					<button onClick={rejectBuddy}>Next</button>
				</div>
			</div>
		</div>
	);
}

export default Home;
