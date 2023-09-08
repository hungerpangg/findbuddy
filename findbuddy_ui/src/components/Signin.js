import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthenticateContext from "../context/authenticate";

function Signin() {
	const navigate = useNavigate();
	const { setAuthenticatedState } = useContext(AuthenticateContext);
	const [state, setState] = useState({
		formDetails: {
			email: "",
			password: "",
		},
		validateDetails: {
			email: "",
			password: "",
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
		try {
			const res = await fetch("http://localhost:4000/login", {
				method: "POST",
				body: JSON.stringify({ email, password }),
				headers: { "Content-Type": "application/json" },
				credentials: "include",
			});
			const data = await res.json();
			if (data.redirected) {
				navigate("/home");
				const { email, userId } = data.data;
				setAuthenticatedState((prevState) => ({
					...prevState,
					isAuthenticated: true,
					secret: userId,
					email,
				}));
			}
			if (data.errors) {
				let errors = data.errors;
				let newError = { email: "", password: "" };
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

	let isEmailValid =
		state.submitted && state.validateDetails.email.length > 0
			? "is-invalid"
			: "";
	let isPasswordValid =
		state.submitted && state.validateDetails.password.length > 0
			? "is-invalid"
			: "";

	console.log(state);

	return (
		<div className="container w-50 mt-5">
			<form className="needs-validation" onSubmit={handleSubmit}>
				<h5>Sign in</h5>
				<div className="form-row mt-3">
					<div className="form-group col-md-6">
						<label for="email" className="form-label">
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
						<label for="password">Password</label>
						<input
							type="password"
							onChange={handleChange}
							className={`form-control ${isPasswordValid}`}
							id="password"
						/>
						<div class="invalid-feedback">{state.validateDetails.password}</div>
					</div>
				</div>
				<button type="submit" className="btn btn-primary">
					Sign in
				</button>
			</form>
		</div>
	);
}

export default Signin;
