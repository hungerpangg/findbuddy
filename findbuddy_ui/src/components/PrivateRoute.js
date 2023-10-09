function PrivateRoute({ element, isAuthenticated, alternateElement }) {
	return isAuthenticated ? element : alternateElement ? alternateElement : null;
}

export default PrivateRoute;
