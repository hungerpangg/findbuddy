import { useState } from "react";

function Signup() {
	const [state, setState] = useState({
		formDetails: {
			description: "",
			lookingFor: "",
			occupation: "",
			school: "",
			images: [],
		},
		validateDetails: {},
		submitted: false,
	});

	const handleChange = (e) => {
		setState((prevData) => ({
			...prevData,
			formDetails: {
				...prevData.formDetails,
				[e.target.id]: e.target.value,
			},
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		let email = state.formDetails.email;
		let password = state.formDetails.password;
		let name = state.formDetails.name;
		let country = state.formDetails.country;
		try {
			const res = await fetch("http://localhost:4000/signup", {
				method: "POST",
				body: JSON.stringify({ email, name, password, country }),
				headers: { "Content-Type": "application/json" },
			});
			const data = await res.json();
			console.log(data);
			if (data.errors) {
				let errors = data.errors;
				let newError = { email: "", password: "", name: "", country: "" };
				errors = Object.assign(newError, errors);
				setState((prevData) => ({
					...prevData,
					validateDetails: {
						...prevData.validateDetails,
						...errors,
					},
					submitted: true,
				}));
			}
			if (data.user) {
				console.log(data.user, "success!");
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

	console.log(state, isNameValid);

	return (
		<div className="container w-50 mt-5">
			<p class="text-justify text-center">
				Include more details for people to search for you if they have similar
				interests!
			</p>
			<form className="needs-validation" onSubmit={handleSubmit}>
				{/* <h5>Description</h5> */}
				<div className="form-row mt-3">
					<div class="col-md-12 mb-3">
						<label for="validationTextarea" class="form-label font-weight-bold">
							Looking for
						</label>
						<textarea
							class="form-control is-invalid"
							id="validationTextarea"
							placeholder="Required example textarea"
							required
						></textarea>
						<p>
							You may write your interests, what you're looking for, acitivities
							you attend... It can be anything! Just note that the words here
							will be what comes up in other buddy's search results. If you put
							"tennis" here, another buddy will see your profile if they are
							searching for tennis buddies.
						</p>
						<div class="invalid-feedback">
							Please enter a message in the textarea.
						</div>
					</div>
					<div class="col-md-12 mb-3">
						<label for="validationTextarea" class="form-label font-weight-bold">
							Description
						</label>
						<textarea
							class="form-control is-invalid"
							id="validationTextarea"
							placeholder="Required example textarea"
							required
						></textarea>
						<p>
							You may write a description about yourself, your personality, what
							kind of buddy personalities are you looking for, it can be
							anything you want to include!
						</p>
						<div class="invalid-feedback">
							Please enter a message in the textarea.
						</div>
					</div>
					<div className="form-group col-md-6">
						<label htmlFor="name" className="form-label">
							Occupation
						</label>
						<input
							type="text"
							id="name"
							onChange={handleChange}
							value={state.formDetails.name}
							className={`form-control ${isNameValid}`}
						/>
						<div class="invalid-feedback">{state.validateDetails.name}</div>
					</div>
					<div className="form-group col-md-6">
						<label htmlFor="country">Age</label>
						<input
							type="number"
							onChange={handleChange}
							className={`form-control ${isCountryValid}`}
							id="country"
						/>
						<div class="invalid-feedback">{state.validateDetails.country}</div>
					</div>
				</div>
				<button type="submit" className="btn btn-primary">
					Sign up
				</button>
			</form>
		</div>
	);
}

export default Signup;
