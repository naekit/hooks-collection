import React, { useState } from "react"

import IngredientForm from "./IngredientForm"
import IngredientList from "./IngredientList"
import Search from "./Search"

const Ingredients = () => {
	const [ingredients, setIngredients] = useState([])

	const addIngredientHandler = (ingredient) => {
		setIngredients((prevIngredients) => [
			...prevIngredients,
			{ id: Math.random().toString(), ...ingredient },
		])
	}

	const removeIngredientHandler = (ingredientId) => {
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
				<Search />
				<IngredientList
					onRemoveItem={removeIngredientHandler}
					ingredients={ingredients}
				/>
			</section>
		</div>
	)
}

export default Ingredients
