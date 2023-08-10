import Card from "./components/Card";
import Signup from "./components/Signup";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signin from "./components/Signin";
import Signup2 from "./components/Signup2";
import Profile from "./components/Profile";
import SignedInNavbar from "./components/SignedInNavbar";
import "./index.css";

function App() {
	return (
		<div>
			<Router>
				<SignedInNavbar />
				<Routes>
					{/* <Route path="/signin" /> */}
					<Route path="/signin" element={<Signin />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/signup2" element={<Signup2 />} />
					<Route path="/profile/:id" element={<Profile />} />
				</Routes>
			</Router>
			{/* <Card/> */}
		</div>
	);
}

export default App;
