import { useState, useEffect } from "react";
import ImageGallery from "react-image-gallery";
import { useNavigate } from "react-router-dom";

function Profile() {
	const navigate = useNavigate();
	const [isEditMode, setIsEditMode] = useState(false);
	const [state, setState] = useState({
		formDetails: {
			name: "",
			description: "",
			lookingFor: "",
			occupation: "",
			age: "",
			pictureUrls: [],
		},
	});

	const getProfile = async () => {
		try {
			const res = await fetch("http://localhost:4000/profile", {
				method: "GET",
				credentials: "include",
			});
			const data = await res.json();
			console.log(data);
			if (data.error) {
				navigate("/signup");
			}
			setState((prevState) => {
				return {
					formDetails: {
						name: data.name,
						description: data.description,
						lookingFor: data.lookingFor,
						occupation: data.occupation,
						age: data.age,
						pictureUrls: data.pictureUrls,
					},
				};
			});
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		getProfile();
	}, []);

	const images =
		state.formDetails.pictureUrls.length > 0
			? state.formDetails.pictureUrls.map((pictureUrl) => {
					return { original: pictureUrl, thumbnail: pictureUrl };
			  })
			: [];

	const handleEditButtonClick = () => {
		// Toggle the edit mode when the Edit button is clicked
		setIsEditMode(!isEditMode);
	};

	const handleSaveButtonClick = () => {
		// Save the edited profile data and switch back to view mode
		setIsEditMode(false);
		// You can make API requests here to save the data on the server if needed.
	};

	console.log(state, "stateObject");

	return (
		<div>
			<div className="d-flex justify-content-end mr-5 mt-4">
				<button onClick={handleEditButtonClick}>Edit</button>
			</div>
			<h2 className="d-flex justify-content-center">
				{state.formDetails.name}
			</h2>
			{isEditMode ? (
				// Render the edit form when in edit mode
				<div>
					<label>
						Name:
						<input type="text" />
					</label>
					<label>
						Email:
						<input type="text" />
					</label>
					<label>
						Bio:
						<textarea type="text" />
					</label>
					<button onClick={handleSaveButtonClick}>Save</button>
				</div>
			) : (
				// Render the view mode when not in edit mode
				<div className="container px-0">
					<div className="row g-2">
						<div className="col-sm-4">
							<h5>Looking for</h5>
							{state.formDetails.lookingFor}
						</div>
						<div className="col-sm-4 d-flex align-items-center justify-content-center">
							{/* <img
								src="/stock1.jpeg"
								className="img-fluid rounded-circle round-img"
							/> */}
							<ImageGallery items={images} />
						</div>
						<div className="col-sm-4 d-flex align-items-center">
							<ul className="list-unstyled">
								<li>
									<span>Country: {state.formDetails.lookingFor}</span>
								</li>
								<li>
									<span>Occupation: {state.formDetails.occupation}</span>
								</li>
								<li>
									<span>Age: {state.formDetails.age}</span>
								</li>
							</ul>
							{/* <span>Country: Singapore</span>
							<span>Occupation: Engineer</span>
							<span>Age: 15</span> */}
						</div>
					</div>
					<hr />
					<h3 className="d-flex justify-content-center m-5">About me</h3>
					<div className="text-center">{state.formDetails.description}</div>
				</div>
			)}
		</div>
	);
}

export default Profile;
