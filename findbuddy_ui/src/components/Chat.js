import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthenticateContext from "../context/authenticate";
import { ChatEngine, ChatHeader, ChatSettingsTop } from "react-chat-engine";

function Chat() {
	const navigate = useNavigate();
	const {
		authenticatedState: { userId, email, secret },
	} = useContext(AuthenticateContext);
	const [currentUser, setCurrentUser] = useState({
		username: email,
		secret,
	});

	useEffect(() => {
		setCurrentUser((prevState) => ({
			...prevState,
			username: email,
			secret,
		}));
	}, [userId]);

	console.log(currentUser, "currentUser");

	const handleChatSettingsTopClick = (chat) => {
		console.log(chat);
		const { people } = chat;
		const target = people.filter((each) => {
			return each.person.username !== currentUser.username;
		});
		const targetEmail = target[0].person.username;
		navigate(`/profile/${targetEmail}`);
	};

	return (
		currentUser.username.length > 0 && (
			<ChatEngine
				projectID="
                00b0b622-9275-438f-9de0-2d9dff028a21"
				userName={currentUser.username}
				userSecret={currentUser.secret}
				// Customize UI
				// renderChatHeader={(chat) => (
				// 	<div onClick={handleChatHeader} style={{ cursor: "pointer" }}>
				// 		<ChatHeader />
				// 	</div>
				// )}
				renderPeopleSettings={(creds, chat) => ""}
				renderPhotosSettings={(chat) => ""}
				renderChatSettingsTop={(creds, chat) => (
					<div
						onClick={() => {
							handleChatSettingsTopClick(chat);
						}}
						style={{ cursor: "pointer" }}
					>
						{/* {console.log(chat)} */}
						<ChatSettingsTop />
					</div>
				)}
			></ChatEngine>
		)
	);
}

export default Chat;
