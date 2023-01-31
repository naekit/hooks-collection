import React, { useCallback, useState } from "react"

import IngredientForm from "./IngredientForm"
import IngredientList from "./IngredientList"
import Search from "./Search"

const Ingredients = () => {
	const [ingredients, setIngredients] = useState([])

	const filteredIngredientsHandler = useCallback((filteredIngredients) => {
		setIngredients(filteredIngredients)
	}, [])

	const addIngredientHandler = async (ingredient) => {
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
	}

	const removeIngredientHandler = async (ingredientId) => {
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
	}

	return (
		<div className="App">
			<IngredientForm addIngredient={addIngredientHandler} />

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
