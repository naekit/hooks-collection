import { useCallback, useReducer, useState } from "react"

// a custom useHttp hook to handle http requests using fetch API
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
			return { ...curHttpState, error: null }
		default:
			throw new Error("Should not be reached!")
	}
}

const useHttp = () => {
	const [httpState, dispatchHttp] = useReducer(httpReducer, {
		loading: false,
		error: null,
		data: null,
		extra: null,
		identifier: null,
	})

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

	const clearError = useCallback(() => {
		dispatchHttp({ type: "CLEAR" })
	}, [])

	return {
		loading: httpState.loading,
		error: httpState.error,
		data: httpState.data,
		sendRequest,
		clearError,
		extra: httpState.extra,
		identifier: httpState.identifier,
	}
}

export default useHttp
