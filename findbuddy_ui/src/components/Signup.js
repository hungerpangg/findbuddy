import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthenticateContext from "../context/authenticate";

function Signup() {
	const navigate = useNavigate();
	const { setAuthenticatedState } = useContext(AuthenticateContext);
	const [state, setState] = useState({
		formDetails: {
			email: "",
			password: "",
			name: "",
			country: "",
		},
		validateDetails: {
			email: "",
			password: "",
			name: "",
			country: "",
		},
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
			const res = await fetch("https://api.findbuddyhub.com/signup", {
				method: "POST",
				body: JSON.stringify({ email, name, password, country }),
				headers: { "Content-Type": "application/json" },
				credentials: "include",
			});
			const data = await res.json();
			if (data.redirected) {
				navigate("/signup2");
				const { email, userId } = data.data;
				setAuthenticatedState((prevState) => ({
					...prevState,
					userId,
				}));
			}

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
			<form className="needs-validation" onSubmit={handleSubmit}>
				<h5>Registration Form</h5>
				<div className="form-row mt-3">
					<div className="form-group col-md-6">
						<label htmlFor="email" className="form-label">
							Email
						</label>
						<input
							type="email"
							onChange={handleChange}
							id="email"
							className={`form-control ${isEmailValid}`}
						/>
						{state.submitted && state.validateDetails.email.length > 0 && (
							<div class="invalid-feedback">{state.validateDetails.email}</div>
						)}
					</div>
					<div className="form-group col-md-6">
						<label htmlFor="password">Password</label>
						<input
							type="password"
							onChange={handleChange}
							className={`form-control ${isPasswordValid}`}
							id="password"
						/>
						<div class="invalid-feedback">{state.validateDetails.password}</div>
					</div>
					<div className="form-group col-md-6">
						<label htmlFor="name" className="form-label">
							Name
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
						<label htmlFor="country">Country</label>
						<input
							type="text"
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
