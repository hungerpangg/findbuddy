import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthenticateContext from "../context/authenticate";

function Match({ matchedUser, hideModal }) {
	const navigate = useNavigate();
	const { setAuthenticatedState } = useContext(AuthenticateContext);

	return (
		<div>
			<div
				className="modal fade"
				id="exampleModal2"
				tabIndex="-1"
				role="dialog"
				aria-labelledby="exampleModalLabel"
				aria-hidden="true"
			>
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="exampleModalLabel">
								You made a new buddy: {matchedUser?.name}
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
						<div className="modal-body">
							<img
								src={
									matchedUser.pictureUrls?.length > 0
										? matchedUser.pictureUrls?.[0]
										: "https://findbuddy-pictures.s3.ap-southeast-1.amazonaws.com/no-profile-picture.jpeg"
								}
								style={{ width: "300px", height: "300px" }}
							></img>
							<p>
								<a
									onClick={() => {
										navigate(`/profile/${matchedUser.email}`);
										hideModal();
									}}
									role="button"
									class="btn btn-secondary popover-test"
									title="Popover title"
									data-bs-dismiss="modal"
									style={{ marginTop: "1em", cursor: "pointer" }}
								>
									See profile
								</a>{" "}
							</p>
						</div>
						<div className="modal-footer">
							<p
								style={{
									marginRight: "1em",
									marginBottom: "0",
								}}
							>
								Do you want to start chatting now?
							</p>
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
								data-bs-dismiss="modal"
								onClick={() => {
									navigate("/chats");
									hideModal();
								}}
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

export default Match;
