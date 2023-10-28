import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthenticateContext from "../context/authenticate";

function Signout() {
	const navigate = useNavigate();
	const { setAuthenticatedState } = useContext(AuthenticateContext);
	const handleSignout = async () => {
		try {
			const res = await fetch("https://api.findbuddyhub/logout", {
				method: "GET",
				credentials: "include",
			});
			if (res.ok) {
				navigate("/");
				setAuthenticatedState((prevState) => ({
					...prevState,
					isAuthenticated: false,
					userId: "",
				}));
			}
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div>
			<div
				className="modal fade"
				id="exampleModal"
				tabIndex="-1"
				role="dialog"
				aria-labelledby="exampleModalLabel"
				aria-hidden="true"
			>
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="exampleModalLabel">
								Confirmation
							</h5>
							<button
								type="button"
								className="close"
								data-bs-dismiss="modal"
								aria-label="Close"
							>
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div className="modal-body">Are you sure you want to sign out?</div>
						<div className="modal-footer">
							<button
								type="button"
								className="btn btn-secondary"
								data-bs-dismiss="modal"
							>
								No
							</button>
							<button
								type="button"
								className="btn btn-primary"
								onClick={handleSignout}
								data-bs-dismiss="modal"
							>
								Yes
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Signout;
