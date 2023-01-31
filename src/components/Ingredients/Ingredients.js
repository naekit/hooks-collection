import React, { useCallback, useState } from "react"
import ErrorModal from "../UI/ErrorModal"

import IngredientForm from "./IngredientForm"
import IngredientList from "./IngredientList"
import Search from "./Search"

const Ingredients = () => {
	const [ingredients, setIngredients] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState()

	const filteredIngredientsHandler = useCallback((filteredIngredients) => {
		setIngredients(filteredIngredients)
	}, [])

	const addIngredientHandler = async (ingredient) => {
		setIsLoading(true)
		try {
			const res = await fetch(
				"https://hooks-ref-default-rtdb.firebaseio.com/ingredients.json",
				{
					method: "POST",
					body: JSON.stringify(ingredient),
					headers: { "Content-Type": "application/json" },
				}
			)
			const data = await res.json()
			setIngredients((prevIngredients) => [
				...prevIngredients,
				{ id: data.name, ...ingredient },
			])
			setIsLoading(false)
		} catch (error) {
			setError("something went wrong!")
			setIsLoading(false)
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
			setIngredients((prevIngredients) =>
				prevIngredients.filter(
					(ingredient) => ingredient.id !== ingredientId
				)
			)
		} catch (error) {
			setError("something went wrong!")
		}
	}

	const clearError = () => {
		setError(null)
	}

	return (
		<div className="App">
			{error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
			<IngredientForm
				loading={isLoading}
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
