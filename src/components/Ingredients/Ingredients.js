import React, { useCallback, useState, useReducer } from "react"
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

const httpReducer = (curHttpState, action) => {
	switch (action.type) {
		case "SEND":
			return { loading: true, error: null }
		case "RESPONSE":
			return { ...curHttpState, loading: false }
		case "ERROR":
			return { loading: false, error: action.errorMessage }
		case "CLEAR":
			return { ...curHttpState, error: null }
		default:
			throw new Error("Should not be reached!")
	}
}

const Ingredients = () => {
	const [ingredients, dispatch] = useReducer(ingredientReducer, [])
	const [httpState, dispatchHttp] = useReducer(httpReducer, {
		loading: false,
		error: null,
	})
	const [error, setError] = useState()

	const filteredIngredientsHandler = useCallback((filteredIngredients) => {
		dispatch({ type: "SET", ingredients: filteredIngredients })
	}, [])

	const addIngredientHandler = async (ingredient) => {
		dispatchHttp({ type: "SEND" })
		try {
			if (ingredient.title === "" || ingredient.amount === "") {
				throw new Error("Please enter a valid title and amount")
			}
			const res = await fetch(
				"https://hooks-ref-default-rtdb.firebaseio.com/ingredients.json",
				{
					method: "POST",
					body: JSON.stringify(ingredient),
					headers: { "Content-Type": "application/json" },
				}
			)
			const data = await res.json()
			dispatch({
				type: "ADD",
				ingredient: { id: data.name, ...ingredient },
			})
			//
			dispatchHttp({ type: "RESPONSE" })
		} catch (error) {
			console.log(error.message)
			dispatchHttp({ type: "ERROR", errorMessage: error.message })
		}
	}

	const removeIngredientHandler = async (ingredientId) => {
		try {
			const res = await fetch(
				`https://hooks-ref-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
				{
					method: "DELETE",
				}
			)
			const data = await res.json()
			console.log(data)
			dispatch({ type: "DELETE", id: ingredientId })
		} catch (error) {
			dispatchHttp({ type: "ERROR", errorMessage: error.message })
		}
	}

	const clearError = () => {
		dispatchHttp({ type: "CLEAR" })
	}

	return (
		<div className="App">
			{httpState.error && (
				<ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>
			)}
			<IngredientForm
				loading={httpState.loading}
				addIngredient={addIngredientHandler}
			/>

			<section>
				<Search onLoad={filteredIngredientsHandler} />
				<IngredientList
					onRemoveItem={removeIngredientHandler}
					ingredients={ingredients}
				/>
			</section>
		</div>
	)
}

export default Ingredients
