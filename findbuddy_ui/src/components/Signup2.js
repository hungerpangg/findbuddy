import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
	const navigate = useNavigate();
	const [state, setState] = useState({
		formDetails: {
			description: "",
			lookingFor: "",
			occupation: "",
			age: "",
			images: [],
		},
		validateDetails: {},
		submitted: false,
	});

	const [selectedFiles, setSelectedFiles] = useState([]);

	const handleChange = (e) => {
		setState((prevData) => ({
			...prevData,
			formDetails: {
				...prevData.formDetails,
				[e.target.id]: e.target.value,
			},
		}));
	};

	const handleFileChange = (e) => {
		setSelectedFiles([...selectedFiles, ...e.target.files]);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		for (let i = 0; i < selectedFiles.length; i++) {
			formData.append("files", selectedFiles[i]);
		}
		for (let [key, value] of formData.entries()) {
			console.log(key, value);
		}
		try {
			const res = await fetch("https://api.findbuddyhub.com/signup2", {
				method: "POST",
				body: formData,
				credentials: "include",
			});
			const data = await res.json();
			if (data.redirected) {
				navigate(`/profile/${data.id}`);
			}
		} catch (err) {
			console.log(err);
		}
	};

	// validation logic
	let isEmailValid =
		state.submitted && state.validateDetails.email.length > 0
			? "is-invalid"
			: "";
	let isPasswordValid =
		state.submitted && state.validateDetails.password.length > 0
			? "is-invalid"
			: "";
	let isNameValid =
		state.submitted && state.validateDetails.name.length > 0
			? "is-invalid"
			: "";
	let isCountryValid =
		state.submitted && state.validateDetails.country.length > 0
			? "is-invalid"
			: "";

	return (
		<div className="container w-50 mt-5">
			<p className="text-justify text-center">
				Include more details for people to search for you if they have similar
				interests!
			</p>
			<form
				className="needs-validation"
				onSubmit={handleSubmit}
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
							value={state.formDetails.lookingFor}
							className="form-control"
							placeholder="Placeholder"
							// required
						></textarea>
						<p>
							You may write your interests, what you're looking for, acitivities
							you attend... It can be anything! Just note that the words here
							will be what comes up in other buddy's search results. If you put
							"tennis" here, another buddy will see your profile if they are
							searching for tennis buddies.
						</p>
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
							value={state.formDetails.description}
							id="description"
							name="description"
							placeholder="Placeholder"
							// required
						></textarea>
						<p>
							You may write a description about yourself, your personality, what
							kind of buddy personalities are you looking for, it can be
							anything you want to include!
						</p>
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
							value={state.formDetails.occupation}
							className={`form-control ${isNameValid}`}
						/>
						<div className="invalid-feedback">{state.validateDetails.name}</div>
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
							value={state.formDetails.age}
							className={`form-control ${isCountryValid}`}
						/>
						<div className="invalid-feedback">
							{state.validateDetails.country}
						</div>
					</div>
					<div className="form-group col-md-6">
						<label htmlFor="pictures" className="font-weight-bold">
							Pictures
						</label>
						<input
							type="file"
							multiple
							onChange={handleFileChange}
							className={`form-control ${isCountryValid}`}
							id="pictures"
						/>
						<div className="invalid-feedback">
							{state.validateDetails.country}
						</div>
						<ul>
							{selectedFiles.map((file, index) => {
								return <li key={index}>{file.name}</li>;
							})}
						</ul>
					</div>
				</div>
				<button type="submit" className="btn btn-primary">
					Submit
				</button>
			</form>
		</div>
	);
}

export default Signup;
