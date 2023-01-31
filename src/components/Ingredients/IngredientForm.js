import React, { useRef, useState } from "react"

import Card from "../UI/Card"
import LoadingIndicator from "../UI/LoadingIndicator"
import "./IngredientForm.css"

const IngredientForm = React.memo((props) => {
	// const [formData, setFormData] = useState({ title: "", amount: "" })
	const formRef = useRef()
	const [title, setTitle] = useState("")
	const [amount, setAmount] = useState("")

	const submitHandler = (event) => {
		event.preventDefault()
		// ...
		formRef.current.reset()
		props.addIngredient({ title, amount })
	}

	return (
		<section className="ingredient-form">
			<Card>
				<form ref={formRef} onSubmit={submitHandler}>
					<div className="form-control">
						<label htmlFor="title">Name</label>
						<input
							type="text"
							id="title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
						/>
					</div>
					<div className="form-control">
						<label htmlFor="amount">Amount</label>
						<input
							type="number"
							id="amount"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
						/>
					</div>
					<div className="ingredient-form__actions">
						<button type="submit">Add Ingredient</button>
						{props.loading ? <LoadingIndicator /> : null}
					</div>
				</form>
			</Card>
		</section>
	)
})

export default IngredientForm
