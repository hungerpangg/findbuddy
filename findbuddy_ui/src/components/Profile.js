import { useState, useEffect, useContext } from "react";
import ImageGallery from "react-image-gallery";
import { useNavigate, useParams } from "react-router-dom";
import AuthenticateContext from "../context/authenticate";

function Profile() {
	const navigate = useNavigate();
	const { id } = useParams();
	const {
		authenticatedState: { userId },
	} = useContext(AuthenticateContext);
	const [isEditMode, setIsEditMode] = useState(false);
	const [state, setState] = useState({
		formDetails: {
			name: "",
			description: "",
			lookingFor: "",
			occupation: "",
			age: "",
			country: "",
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
			const res = await fetch(
				`https://findbuddy-server.onrender.com/profile/${id}`,
				{
					method: "GET",
					credentials: "include",
				}
			);
			const data = await res.json();
			if (data.ok) {
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
							country: data.country,
						},
						updateDetails: {
							...prevState.updateDetails,
						},
					};
				});
			} else {
				navigate("/not-found");
			}
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		getProfile();
	}, [id]);

	const handleEditSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		for (let i = 0; i < state.updateDetails.filesToAdd.length; i++) {
			formData.append("files", state.updateDetails.filesToAdd[i]);
		}
		for (let i = 0; i < state.updateDetails.filesToDelete.length; i++) {
			formData.append("filestodelete", state.updateDetails.filesToDelete[i]);
		}
		for (let [key, value] of formData.entries()) {
			console.log(key, value);
		}
		try {
			const res = await fetch(
				"https://findbuddy-server.onrender.com/editprofile",
				{
					method: "POST",
					body: formData,
					credentials: "include",
				}
			);
			const data = await res.json();

			if (data.ok) {
				setIsEditMode(false);
			}
		} catch (err) {
			console.log(err);
		}
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

		const originalName = e.target.previousSibling.textContent;

		const obj = state.selectedFiles.filter((obj) => {
			return obj["originalName"] === originalName;
		});
		const selectedFiles = state.selectedFiles.filter((obj) => {
			return obj["originalName"] !== originalName;
		});
		// if fullName length is 0, means file is newly added and not already there
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
						description: prevData.formDetails.description,
						lookingFor: prevData.formDetails.lookingFor,
						occupation: prevData.formDetails.occupation,
						age: prevData.formDetails.age,
					},
					selectedFiles: editPictures,
				};
			});
			navigate(`/profile/${id}`);
		}
	};

	const isNameValid = "";
	const isCountryValid = "";

	return (
		<div>
			<div className="d-flex justify-content-end mr-5 mt-4">
				{!id.includes("@") && id === userId && (
					<button onClick={handleEditButtonClick} className="btn btn-secondary">
						Edit
					</button>
				)}
			</div>
			{isEditMode ? (
				// Render the edit form when in edit mode
				<div className="container w-50 mt-5">
					<h2 className="d-flex justify-content-center">Edit Profile</h2>
					<form
						className="needs-validation"
						onSubmit={handleEditSubmit}
						encType="multipart/form-data"
					>
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
				// Render the view mode when not in edit mode
				<div className="container px-0">
					<h2 className="d-flex justify-content-center">
						{state.formDetails.name}
					</h2>
					<div className="row g-2 ml-3 mr-3">
						<div className="col-sm-4 m-3">
							<h5>Looking for</h5>
							{state.formDetails.lookingFor}
						</div>
						<div className="col-sm-4 d-flex align-items-center justify-content-center">
							<ImageGallery items={images} />
						</div>
						<div className="col-sm-4 d-flex align-items-center m-3">
							<ul className="list-unstyled">
								<li>
									<span>Country: {state.formDetails.country}</span>
								</li>
								<li>
									<span>Occupation: {state.formDetails.occupation}</span>
								</li>
								<li>
									<span>Age: {state.formDetails.age}</span>
								</li>
							</ul>
						</div>
					</div>
					<hr />
					<h3 className="d-flex justify-content-center m-5">About me</h3>
					<div className="text-center mb-5 ml-3 mr-3	">
						{state.formDetails.description}
					</div>
				</div>
			)}
		</div>
	);
}

export default Profile;
