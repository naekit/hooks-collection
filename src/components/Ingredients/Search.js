import React, { useEffect, useState } from "react"

import Card from "../UI/Card"
import "./Search.css"

const Search = React.memo(({ onLoad }) => {
	const [filter, setFilter] = useState("")

	useEffect(() => {
		const query =
			filter.length === 0 ? "" : `?orderBy="title"&equalTo="${filter}"`
		fetch(
			"https://hooks-ref-default-rtdb.firebaseio.com/ingredients.json" +
				query
		)
			.then((res) => res.json())
			.then((data) => {
				const loadedIngredients = []
				for (const key in data) {
					loadedIngredients.push({
						id: key,
						title: data[key].title,
						amount: data[key].amount,
					})
				}
				// ... trigger something in ingredients
				onLoad(loadedIngredients)
			})
	}, [filter, onLoad])

	return (
		<section className="search">
			<Card>
				<div className="search-input">
					<label>Filter by Title</label>
					<input
						type="text"
						value={filter}
						onChange={(e) => setFilter(e.target.value)}
					/>
				</div>
			</Card>
		</section>
	)
})

export default Search
