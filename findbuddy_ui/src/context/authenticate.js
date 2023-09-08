import { useState, createContext, useCallback } from "react";

const AuthenticateContext = createContext();

function Provider({ children }) {
	// const [isAuthenticated, setIsAuthenticated] = useState(false);
	// const [userId, setUserId] = useState("");
	const [authenticatedState, setAuthenticatedState] = useState({
		isAuthenticated: false,
		userId: "",
		secret: "",
		email: "",
	});

	function checkJwtCookie(cookieName) {
		const cookies = document.cookie.split(";");
		for (const cookie of cookies) {
			const [name, value] = cookie.trim().split("=");
			if (name === cookieName) {
				return true; // Cookie found
			}
		}
		return false; // Cookie not found
	}

	const jwtCookieExists = checkJwtCookie("jwt");
	console.log(jwtCookieExists);
	if (jwtCookieExists && authenticatedState.userId.length === 0) {
		console.log("JWT cookie exists");
		// Get id of jwt token
		const token = document.cookie;
		const parts = token.split(".");
		const payload = parts[1];
		const decodedPayload = window.atob(payload);
		const payloadObject = JSON.parse(decodedPayload);
		const { id } = payloadObject;
		setAuthenticatedState((prevState) => ({
			...prevState,
			isAuthenticated: true,
			userId: id,
		}));
	} else {
		console.log("JWT cookie does not exist");
	}

	const valueToShare = {
		checkJwtCookie,
		authenticatedState,
		setAuthenticatedState,
	};

	console.log(authenticatedState);

	return (
		<AuthenticateContext.Provider value={valueToShare}>
			{children}
		</AuthenticateContext.Provider>
	);
}

export { Provider };
export default AuthenticateContext;
