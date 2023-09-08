import { useState, useEffect, useContext, useMemo } from "react";
import AuthenticateContext from "../context/authenticate";
import { ChatEngine } from "react-chat-engine";

function Chat() {
	const {
		authenticatedState: { userId, email, secret },
	} = useContext(AuthenticateContext);
	const [currentUser, setCurrentUser] = useState({
		username: email,
		secret,
	});

	// useEffect(() => {
	// 	fetch("http://localhost:4000/authenticateChat", {
	// 		method: "POST",
	// 		body: JSON.stringify({ userId }),
	// 		headers: { "Content-Type": "application/json" },
	// 	})
	// 		.then((res) => {
	// 			return res.json();
	// 		})
	// 		.then((data) => {
	// 			const { username, secret } = data.data;
	// 			console.log(username, secret);
	// 			setCurrentUser((prevState) => {
	// 				return {
	// 					...prevState,
	// 					username,
	// 					secret,
	// 				};
	// 			});
	// 		})
	// 		.catch((err) => console.log(err));
	// }, []);

	console.log(currentUser, "currentUser");

	return (
		currentUser.username.length > 0 && (
			<ChatEngine
				projectID="7e212bf9-67c2-4d70-b9f3-d6a61962d56a"
				userName={currentUser.username}
				userSecret={currentUser.secret}
			/>
		)
	);
}

export default Chat;
