import React, { useCallback, useEffect, useMemo, useReducer } from "react"
import useHttp from "../../hooks/http"
import ErrorModal from "../UI/ErrorModal"

import IngredientForm from "./IngredientForm"
import IngredientList from "./IngredientList"
import Search from "./Search"

const ingredientReducer = (currentIngredients, action) => {
	switch (action.type) {
		case "SET":
			return action.ingredients
		case "ADD":
			return [...currentIngredients, action.ingredient]
		case "DELETE":
			return currentIngredients.filter((ing) => ing.id !== action.id)
		default:
			throw new Error("Should not get there!")
	}
}

const Ingredients = () => {
	const [ingredients, dispatch] = useReducer(ingredientReducer, [])
	const { loading, error, data, sendRequest, extra, identifier } = useHttp()

	useEffect(() => {
		if (!loading && !error && identifier === "REMOVE_INGREDIENT") {
			dispatch({ type: "DELETE", id: extra })
		} else if (!loading && !error && identifier === "ADD_INGREDIENT") {
			dispatch({ type: "ADD", ingredient: { id: data.name, ...extra } })
		}
	}, [data, extra, identifier, loading, error])

	const filteredIngredientsHandler = useCallback((filteredIngredients) => {
		dispatch({ type: "SET", ingredients: filteredIngredients })
	}, [])

	const addIngredientHandler = useCallback(
		async (ingredient) => {
			sendRequest(
				"https://hooks-ref-default-rtdb.firebaseio.com/ingredients.json",
				"POST",
				JSON.stringify(ingredient),
				ingredient,
				"ADD_INGREDIENT"
			)
			// try {
			// 	if (ingredient.title === "" || ingredient.amount === "") {
			// 		throw new Error("Please enter a valid title and amount")
			// 	}
			// 	const res = await fetch(
			// 		"https://hooks-ref-default-rtdb.firebaseio.com/ingredients.json",
			// 		{
			// 			method: "POST",
			// 			body: JSON.stringify(ingredient),
			// 			headers: { "Content-Type": "application/json" },
			// 		}
			// 	)
			// 	const data = await res.json()
			// 	dispatch({
			// 		type: "ADD",
			// 		ingredient: { id: data.name, ...ingredient },
			// 	})
			// 	//
			// } catch (error) {
			// 	console.log(error.message)
			// }
		},
		[sendRequest]
	)

	// const removeIngredientHandler = useCallback(async (ingredientId) => {
	// 	try {
	// 		const res = await fetch(
	// 			`https://hooks-ref-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
	// 			{
	// 				method: "DELETE",
	// 			}
	// 		)
	// 		const data = await res.json()
	// 		dispatch({ type: "DELETE", id: ingredientId })
	// 	} catch (error) {
	// 		dispatchHttp({ type: "ERROR", errorMessage: error.message })
	// 	}
	// }, [])

	const removeIngredientHandler = useCallback(
		(ingredientId) => {
			sendRequest(
				`https://hooks-ref-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
				"DELETE",
				null,
				ingredientId,
				"REMOVE_INGREDIENT"
			)
		},
		[sendRequest]
	)

	const clearError = useCallback(() => {
		// dispatchHttp({ type: "CLEAR" })
	}, [])

	const ingredientList = useMemo(() => {
		return (
			<IngredientList
				onRemoveItem={removeIngredientHandler}
				ingredients={ingredients}
			/>
		)
	}, [ingredients, removeIngredientHandler])

	return (
		<div className="App">
			{error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
			<IngredientForm
				loading={loading}
				addIngredient={addIngredientHandler}
			/>
			<section>
				<Search onLoad={filteredIngredientsHandler} />
				{ingredientList}
			</section>
		</div>
	)
}

export default Ingredients
