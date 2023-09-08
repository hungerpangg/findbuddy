import { useContext, useEffect } from "react";
import AuthenticateContext from "./context/authenticate";
import Signup from "./components/Signup";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signin from "./components/Signin";
import Signup2 from "./components/Signup2";
import Profile from "./components/Profile";
import SignedInNavbar from "./components/SignedInNavbar";
import SignedOutNavbar from "./components/SignedOutNavbar";
import "./index.css";
import Home from "./components/Home";
import Chat from "./components/Chat";

function App() {
	const {
		authenticatedState: { isAuthenticated, userId },
	} = useContext(AuthenticateContext);

	return (
		<div style={{ margin: "0", padding: "0" }}>
			<Router>
				{isAuthenticated ? <SignedInNavbar /> : <SignedOutNavbar />}
				<Routes>
					{/* <Route path="/signin" /> */}
					<Route path="/home" element={<Home />} />
					<Route path="/signin" element={<Signin />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/signup2" element={<Signup2 />} />
					<Route path="/profile/:id" element={<Profile />} />
					<Route path="/chats" element={<Chat />} />
				</Routes>
			</Router>

			{/* <Card/> */}
		</div>
	);
}

export default App;
