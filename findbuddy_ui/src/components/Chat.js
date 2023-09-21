import { useState, useContext, useEffect, useRef } from "react";
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
		console.log(chat);
		const { people } = chat;
		const target = people?.filter((each) => {
			return each.person.username !== currentUser.username;
		});
		const targetEmail = target[0].person.username;
		console.log(targetEmail, "targetemail");
		navigate(`/profile/${targetEmail}`);
	};

	return (
		<div>
			{/* <div
				className="chat-profile-link"
				onClick={async () => {
					const data = await JSON.parse(
						currentChat.current.getAttribute("chatValue")
					);
					console.log(data, "chatValue");
					handleChatSettingsTopClick(data);
				}}
			>
				Click to go to profile
			</div> */}
			{currentUser.username.length > 0 && (
				<ChatEngine
					projectID="
                00b0b622-9275-438f-9de0-2d9dff028a21"
					userName={currentUser.username}
					userSecret={currentUser.secret}
					// Customize UI
					renderPeopleSettings={(creds, chat) => ""}
					renderPhotosSettings={(chat) => ""}
					renderNewChatForm={(creds) => ""}
					renderChatSettingsTop={(creds, chat) => (
						<div
							// ref={currentChat}
							// chatValue={JSON.stringify(chat)}
							style={{ cursor: "pointer" }}
							onClick={() => handleChatSettingsTopClick(chat)}
						>
							{console.log(chat)}
							<ChatSettingsTop />
						</div>
					)}
				></ChatEngine>
			)}
		</div>
	);
}

export default Chat;
