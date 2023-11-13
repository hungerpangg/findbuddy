import { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AuthenticateContext from "../context/authenticate";
import { ChatEngine, ChatSettingsTop } from "react-chat-engine";

function Chat() {
	const navigate = useNavigate();
	const {
		authenticatedState: { userId, email, secret },
	} = useContext(AuthenticateContext);
	const [currentUser, setCurrentUser] = useState({
		username: email,
		secret,
		currentChat: {},
	});

	// const currentChat = useRef();

	useEffect(() => {
		setCurrentUser((prevState) => ({
			...prevState,
			username: email,
			secret,
		}));
	}, [userId]);

	console.log(currentUser, "currentUser");

	const handleChatSettingsTopClick = (chat) => {
		const { people } = chat;
		const target = people?.filter((each) => {
			return each.person.username !== currentUser.username;
		});
		const targetEmail = target?.[0].person.username;
		console.log(targetEmail, "targetemail");
		navigate(`/profile/${targetEmail}`);
	};

	return (
		<div>
			{currentUser.username.length > 0 && (
				<ChatEngine
					projectID="7e212bf9-67c2-4d70-b9f3-d6a61962d56a"
					userName={currentUser.username}
					userSecret={currentUser.secret}
					// Customize UI
					renderPeopleSettings={(creds, chat) => ""}
					renderPhotosSettings={(chat) => ""}
					renderNewChatForm={(creds) => ""}
					renderChatSettingsTop={(creds, chat) => {
						return (
							<div
								style={{ cursor: "pointer" }}
								onClick={() => handleChatSettingsTopClick(chat)}
							>
								<ChatSettingsTop />
							</div>
						);
					}}
				></ChatEngine>
			)}
		</div>
	);
}

export default Chat;
