import { useState, useEffect } from "react";
import ImageGallery from "react-image-gallery";
import { useNavigate, useParams } from "react-router-dom";

function Profile() {
	const navigate = useNavigate();
	const { id } = useParams();
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
		updateDetails: {
			description: "",
			lookingFor: "",
			occupation: "",
			age: "",
			images: [],
			filesToDelete: [],
			filesToAdd: [],
		},
		selectedFiles: [],
	});

	const getProfile = async () => {
		try {
			const res = await fetch(`http://localhost:4000/profile/${id}`, {
				method: "GET",
				credentials: "include",
			});
			const data = await res.json();
			console.log(data);
			// if (data.error) {
			// 	navigate("/signup");
			// }
			setState((prevState) => {
				return {
					...prevState,
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

	const handleEditSubmit = (e) => {
		return null;
	};

	const handleChange = (e) => {
		setState((prevData) => ({
			...prevData,
			updateDetails: {
				...prevData.updateDetails,
				[e.target.id]: e.target.value,
			},
		}));
	};

	const handleFileChange = (e) => {
		// setSelectedFiles([...selectedFiles, ...e.target.files]);
		// console.log(e.target.files[0].name);
		setState((prevData) => {
			return {
				...prevData,
				updateDetails: {
					...prevData.updateDetails,
					filesToAdd: [...prevData.updateDetails.filesToAdd, e.target.files[0]],
				},
				selectedFiles: [
					...prevData.selectedFiles,
					{
						originalName: e.target.files[0].name,
						fullName: "",
					},
				],
			};
		});
	};

	const removePicture = (e) => {
		e.preventDefault();
		console.dir(e.target.previousSibling.textContent);
		const originalName = e.target.previousSibling.textContent;
		console.log(originalName, "originalName");
		const obj = state.selectedFiles.filter((obj) => {
			return obj["originalName"] === originalName;
		});
		const selectedFiles = state.selectedFiles.filter((obj) => {
			return obj["originalName"] !== originalName;
		});
		if (obj[0].fullName.length === 0) {
			const selectedAddFiles = state.updateDetails.filesToAdd.filter((obj) => {
				return obj["name"] !== originalName;
			});
			return setState((prevData) => {
				return {
					...prevData,
					updateDetails: {
						...prevData.updateDetails,
						filesToAdd: selectedAddFiles,
					},
					selectedFiles,
				};
			});
		}
		const fullName = obj[0].fullName;
		setState((prevData) => {
			return {
				...prevData,
				updateDetails: {
					...prevData.updateDetails,
					filesToDelete: [
						...prevData.updateDetails.filesToDelete,
						obj[0].fullName,
					],
				},
				selectedFiles,
			};
		});
	};

	const images =
		state.formDetails.pictureUrls.length > 0
			? state.formDetails.pictureUrls.map((pictureUrl) => {
					return { original: pictureUrl, thumbnail: pictureUrl };
			  })
			: [];
	if (images.length < 1) {
		images.push({
			original:
				"https://findbuddy-pictures.s3.ap-southeast-1.amazonaws.com/no-profile-picture.jpeg",
			thumbnail:
				"https://findbuddy-pictures.s3.ap-southeast-1.amazonaws.com/no-profile-picture.jpeg",
		});
	}

	const handleEditButtonClick = () => {
		// Toggle the edit mode when the Edit button is clicked
		setIsEditMode(!isEditMode);
		if (
			state.formDetails.pictureUrls[0] !==
			"https://findbuddy-pictures.s3.ap-southeast-1.amazonaws.com/no-profile-picture.jpeg"
		) {
			const editPictures = state.formDetails.pictureUrls.map((url) => {
				return { originalName: url.substring(84), fullName: url };
			});
			setState((prevData) => {
				return {
					...prevData,
					updateDetails: {
						...prevData.updateDetails,
						filesToDelete: [],
						filesToAdd: [],
					},
					selectedFiles: editPictures,
				};
			});
		}
	};

	const handleSaveButtonClick = () => {
		// Save the edited profile data and switch back to view mode
		setIsEditMode(false);
		// You can make API requests here to save the data on the server if needed.
	};

	console.log(state, "stateObject");
	const isNameValid = "";
	const isCountryValid = "";

	return (
		<div>
			<div className="d-flex justify-content-end mr-5 mt-4">
				<button onClick={handleEditButtonClick}>Edit</button>
			</div>
			{isEditMode ? (
				// Render the edit form when in edit mode
				<div className="container w-50 mt-5">
					{/* <p className="text-justify text-center">
						Include more details for people to search for you if they have
						similar interests!
					</p> */}
					<h2 className="d-flex justify-content-center">Edit Profile</h2>
					<form
						className="needs-validation"
						onSubmit={handleEditSubmit}
						encType="multipart/form-data"
					>
						{/* <h5>Description</h5> */}
						<div className="form-row mt-3">
							<div className="col-md-12 mb-3">
								<label
									htmlFor="validationTextarea"
									className="form-label font-weight-bold"
								>
									Looking for
								</label>
								<textarea
									name="lookingFor"
									id="lookingFor"
									onChange={handleChange}
									value={state.updateDetails.lookingFor}
									className="form-control"
									placeholder={state.formDetails.lookingFor}
									// required
								></textarea>
								{/* <p>
									You may write your interests, what you're looking for,
									acitivities you attend... It can be anything! Just note that
									the words here will be what comes up in other buddy's search
									results. If you put "tennis" here, another buddy will see your
									profile if they are searching for tennis buddies.
								</p> */}
								<div className="invalid-feedback">
									Please enter a message in the textarea.
								</div>
							</div>
							<div className="col-md-12 mb-3">
								<label
									htmlFor="validationTextarea"
									className="form-label font-weight-bold"
								>
									Description
								</label>
								<textarea
									className="form-control"
									onChange={handleChange}
									value={state.updateDetails.description}
									id="description"
									name="description"
									placeholder={state.formDetails.description}
									// required
								></textarea>
								{/* <p>
									You may write a description about yourself, your personality,
									what kind of buddy personalities are you looking for, it can
									be anything you want to include!
								</p> */}
								<div className="invalid-feedback">
									Please enter a message in the textarea.
								</div>
							</div>
							<div className="form-group col-md-6">
								<label htmlFor="name" className="form-label font-weight-bold">
									Occupation
								</label>
								<input
									type="text"
									id="occupation"
									name="occupation"
									onChange={handleChange}
									value={state.updateDetails.occupation}
									placeholder={state.formDetails.occupation}
									className={`form-control ${isNameValid}`}
								/>
								{/* <div className="invalid-feedback">
									{state.validateDetails.name}
								</div> */}
							</div>
							<div className="form-group col-md-6">
								<label htmlFor="country" className="font-weight-bold">
									Age
								</label>
								<input
									type="number"
									id="age"
									name="age"
									onChange={handleChange}
									value={state.updateDetails.age}
									placeholder={state.formDetails.age}
									className={`form-control ${isCountryValid}`}
								/>
								{/* <div className="invalid-feedback">
									{state.validateDetails.country}
								</div> */}
							</div>
							<div className="form-group col-md-6">
								<label htmlFor="pictures" className="font-weight-bold">
									Pictures
								</label>
								<input
									type="file"
									onChange={handleFileChange}
									className={`form-control ${isCountryValid}`}
									id="pictures"
								/>
								{/* <div className="invalid-feedback">
									{state.validateDetails.country}
								</div> */}
								<ul className="list-group">
									{state.selectedFiles.length > 0
										? state.selectedFiles.map((file, index) => {
												return (
													<li
														key={index}
														className="list-group-item d-flex justify-content-between align-items-center"
													>
														{file["originalName"]}
														<button
															style={{ "margin-left": "1em" }}
															onClick={removePicture}
														>
															Remove
														</button>
													</li>
												);
										  })
										: ""}
								</ul>
							</div>
						</div>
						<button type="submit" className="btn btn-primary">
							Save
						</button>
					</form>
				</div>
			) : (
				// <div>
				// 	<label>
				// 		Name:
				// 		<input type="text" />
				// 	</label>
				// 	<label>
				// 		Email:
				// 		<input type="text" />
				// 	</label>
				// 	<label>
				// 		Bio:
				// 		<textarea type="text" />
				// 	</label>
				// 	<button onClick={handleSaveButtonClick}>Save</button>
				// </div>
				// Render the view mode when not in edit mode
				<div className="container px-0">
					<h2 className="d-flex justify-content-center">
						{state.formDetails.name}
					</h2>
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
