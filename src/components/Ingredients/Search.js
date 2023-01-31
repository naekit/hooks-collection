import React, { useEffect, useRef, useState } from "react"
import useHttp from "../../hooks/http"

import Card from "../UI/Card"
import ErrorModal from "../UI/ErrorModal"
import "./Search.css"

const Search = React.memo(({ onLoad }) => {
	const [filter, setFilter] = useState("")
	const inputRef = useRef()
	const { loading, data, error, sendRequest, clear } = useHttp()

	useEffect(() => {
		const timer = setTimeout(() => {
			if (filter === inputRef.current.value) {
				const query =
					filter.length === 0
						? ""
						: `?orderBy="title"&equalTo="${filter}"`
				sendRequest(
					"https://hooks-ref-default-rtdb.firebaseio.com/ingredients.json" +
						query,
					"GET"
				)
			}
		}, 500)

		return () => {
			clearTimeout(timer)
		}
	}, [filter, sendRequest, inputRef])

	useEffect(() => {
		if (!loading && !error && data) {
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
		}
	}, [data, loading, error, onLoad])

	return (
		<section className="search">
			{error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
			<Card>
				<div className="search-input">
					<label>Filter by Title</label>
					{loading && <span>Loading...</span>}
					<input
						ref={inputRef}
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
