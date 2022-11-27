import { useEffect, useReducer, useRef, useState, createContext, useContext } from 'react'

import styles from './styles.module.css'
const per_page = 5
const allData = new Array(25).fill(0).map((num, i) => i + 1)

const types = {
	start: 'START',
	loaded: 'LOADED',
}
const reducer = (state, action) => {
	switch (action.type) {
		case 'START':
			return { ...state, loading: true }
		case 'LOADED':
			return {
				...state,
				loading: false,
				has_more: action.newData.length === per_page,
				data: [...state.data, ...action.newData],
				after: state.after + action.newData.length,
			}
		default:
			throw new Error("Don't understand action")
	}
}
const Context = createContext()

const ContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, {
		loading: false,
		has_more: true,
		data: [],
		after: 0,
	})
	const { loading, has_more, data, after } = state
	const fetch = () => {
		dispatch({ type: types.start })

		setTimeout(() => {
			const newData = allData.slice(after, after + per_page)
			console.log(data.length)
			console.log(after)
			dispatch({ type: types.loaded, newData })
		}, 300)
	}
	return <Context.Provider value={{ fetch, loading, has_more, data }}>{children}</Context.Provider>
}

const Main = () => {
	const { loading, has_more, data, fetch } = useContext(Context)

	const fetcherRef = useRef(fetch)
	const observer = useRef(
		new IntersectionObserver(
			(enteries) => {
				const first_entry = enteries[0]
				if (first_entry.isIntersecting) {
					fetcherRef.current()
				}
			},
			{ threshold: 1 }
		)
	)

	const [element, setElement] = useState(null)

	useEffect(() => {
		// we have to store the current value as by the time of cleanup the ref's will be pointing to
		// the new value of the observer but we want to it to stop observing the previous value through cleanup
		const currentObserver = observer.current
		const currentElement = element
		if (currentElement) {
			currentObserver.observe(currentElement)
		}

		return () => {
			if (currentElement) {
				currentObserver.unobserve(currentElement)
			}
		}
	}, [element])

	useEffect(() => {
		fetcherRef.current = fetch
	}, [fetch])

	return (
		<div>
			<h1>Lazy Fetch using Intersection Observer</h1>
			<div>
				{data.map((el) => (
					<div key={el} className={styles.elementCont}>
						{el}
					</div>
				))}
			</div>
			<div ref={setElement}>{loading && has_more && <p>loading...</p>}</div>
		</div>
	)
}

const App = () => {
	return (
		<ContextProvider>
			<Main />
		</ContextProvider>
	)
}

export default App
