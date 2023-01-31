import React, { useContext } from "react"
import Auth from "./components/Auth"

import Ingredients from "./components/Ingredients/Ingredients"
import { AuthContext } from "./context/auth-context"

const App = (props) => {
	const authContext = useContext(AuthContext)

	if (authContext.isAuthenticated) {
		return <Ingredients />
	}

	return <Auth />
}

export default App
