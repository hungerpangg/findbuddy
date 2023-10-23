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
import FrontPage from "./components/FrontPage";
import PrivateRoute from "./components/PrivateRoute";
import NotFound from "./components/NotFound";
import { HelmetProvider, Helmet } from "react-helmet-async";
const helmetContext = {};

function App() {
	const {
		authenticatedState: { isAuthenticated, userId },
	} = useContext(AuthenticateContext);

	return (
		<HelmetProvider context={helmetContext}>
			<div style={{ margin: "0", padding: "0" }}>
				<Helmet>
					<title>FindBuddy: Find buddies with similar interests as you</title>
					<meta
						name="description"
						content="Find buddies with similar interests as you to do the
						things you love together!"
					/>
					<meta
						httpEquiv="Content-Security-Policy"
						content={`
                      default-src 'self';
                      script-src 'self' https://api.findbuddyhub.com:4000;
					  connect-src 'self' https://api.findbuddyhub.com:4000 wss://api.chatengine.io/ https://api.chatengine.io/;
                      img-src 'self' https://api.findbuddyhub.com:4000 https://findbuddy-pictures.s3.ap-southeast-1.amazonaws.com/ https://chat-engine-assets.s3.amazonaws.com/;
					  style-src 'self' 'unsafe-inline';
						
                `}
					/>
				</Helmet>
				<Router>
					{isAuthenticated ? <SignedInNavbar /> : <SignedOutNavbar />}
					<Routes>
						<Route
							path="/"
							element={
								<PrivateRoute
									element={<Home />}
									alternateElement={<FrontPage />}
									isAuthenticated={isAuthenticated}
								/>
							}
						/>
						<Route
							path="/home"
							element={
								<PrivateRoute
									element={<Home />}
									alternateElement={<FrontPage />}
									isAuthenticated={isAuthenticated}
								/>
							}
						/>
						<Route
							path="/signin"
							element={
								<PrivateRoute
									element={<Home />}
									alternateElement={<Signin />}
									isAuthenticated={isAuthenticated}
								/>
							}
						/>
						<Route
							path="/signup"
							element={
								<PrivateRoute
									element={<Home />}
									alternateElement={<Signup />}
									isAuthenticated={isAuthenticated}
								/>
							}
						/>
						<Route path="/signup2" element={<Signup2 />} />
						<Route
							path="/chats"
							element={
								<PrivateRoute
									element={<Chat />}
									alternateElement={<Signin />}
									isAuthenticated={isAuthenticated}
								/>
							}
						/>
						<Route path="/profile/:id" element={<Profile />} />
						<Route path="*" element={<NotFound />} />
					</Routes>
				</Router>
			</div>
		</HelmetProvider>
	);
}

export default App;
