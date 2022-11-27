import axios from 'axios'
import { useEffect, useReducer, useRef, useState, useCallback } from 'react'
import parse from 'html-react-parser'
import styles from './styles.module.css'
const per_page = 5

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
				has_more: action.temp_arr.length === per_page,
				data: [...state.data, ...action.temp_arr],
				after: state.after + action.temp_arr.length,
			}
		default:
			throw new Error("Don't understand action")
	}
}
// const Context = createContext()
const Main = () => {
	// const ContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, {
		loading: false,
		has_more: true,
		data: [],
		after: 1,
	})
	const { loading, has_more, data, after } = state
	const fetch = useCallback(() => {
		dispatch({ type: types.start })

		const getData = async () => {
			let last_user = after + per_page
			let crr_user = after
			let temp_arr = []
			for (crr_user; crr_user < last_user; crr_user++) {
				try {
					const fetch_userData_url = `https://jsonplaceholder.typicode.com/posts/${crr_user}`
					const { data } = await axios.get(fetch_userData_url)

					let gender = crr_user % 2 === 0 ? 'male' : 'female'
					const dicebar_avatar_url = `https://avatars.dicebear.com/api/${gender}/${data.title}.svg`
					const { data: avatar } = await axios.get(dicebar_avatar_url)
					temp_arr.push({ ...data, svg: avatar })
				} catch (err) {
					console.log(err)
				}
			}
			dispatch({ type: types.loaded, temp_arr })
		}
		getData()
	}, [after])
	// 	return <Context.Provider value={{ fetch, loading, has_more, data }}>{children}</Context.Provider>
	// }

	// const { loading, has_more, data, fetch } = useContext(Context)

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
			<h1 className={styles.h_one}>Lazy Fetch using Intersection Observer</h1>
			<div className={styles.usersCont}>
				{data.length > 0
					? data.map((user) => (
							<div key={user.id} className={styles.Usercont}>
								<div className={styles.svgCont}>{parse(user.svg)}</div>
								<div className={styles.textCont}>
									<p className={styles.userDotId}>{user.id}</p>
									<p>{user.title}</p>
									<p>{user.body}</p>
									<p>{user.userId}</p>
								</div>
							</div>
					  ))
					: ''}
			</div>
			{has_more && (
				<div>
					<p className={styles.loading}>loading...</p>
				</div>
			)}
			{!loading && has_more && <div ref={setElement}></div>}
		</div>
	)
}

const App = () => {
	return <Main />
}

export default App
