import { useCallback, useReducer } from "react"

const initialState = {
	loading: false,
	error: null,
	data: null,
	extra: null,
	identifier: null,
}

const httpReducer = (curHttpState, action) => {
	switch (action.type) {
		case "SEND":
			return {
				loading: true,
				error: null,
				data: null,
				extra: null,
				identifier: action.identifier,
			}
		case "RESPONSE":
			return {
				...curHttpState,
				loading: false,
				data: action.responseData,
				extra: action.extra,
			}
		case "ERROR":
			return { loading: false, error: action.errorMessage }
		case "CLEAR":
			return initialState
		default:
			throw new Error("Should not be reached!")
	}
}

const useHttp = () => {
	const [httpState, dispatchHttp] = useReducer(httpReducer, initialState)

	const clear = useCallback(() => {
		dispatchHttp({ type: "CLEAR" })
	}, [])

	const sendRequest = useCallback(
		async (url, method, body, extra, reqIdentifier) => {
			dispatchHttp({ type: "SEND", identifier: reqIdentifier })
			try {
				const res = await fetch(url, {
					method: method,
					body: body,
					headers: {
						"Content-Type": "application/json",
					},
				})
				const data = await res.json()
				dispatchHttp({
					type: "RESPONSE",
					responseData: data,
					extra: extra,
				})
			} catch (error) {
				console.log(error.message)
				dispatchHttp({ type: "ERROR", errorMessage: error.message })
			}
		},
		[]
	)

	return {
		loading: httpState.loading,
		error: httpState.error,
		data: httpState.data,
		sendRequest,
		extra: httpState.extra,
		identifier: httpState.identifier,
		clear,
	}
}

export default useHttp
