import { useEffect, useRef, useState, useContext } from 'react'
import parse from 'html-react-parser'
import styles from './styles.module.css'

import ContextProvider, { Context } from './context'

const Main = () => {
	const { loading, has_more, data, fetch } = useContext(Context)

	const fetcherRef = useRef(fetch)
	const observer = useRef(
		new IntersectionObserver(
			(enteries) => {
				const first_entry = enteries[0]
				if (first_entry.isIntersecting) {
					fetcherRef.current()
					//we have to the ref becuase if not this will create a closure around
					// the stale state of fetch which was obtained during the initialization of the observer
					// to avoid stale fetch function we keep it outside the closure of observe ref and update it using
					//  useffect and get it's value using useRef.
				}
			},
			{ threshold: [0] }
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
					: null}
			</div>
			{has_more ? (
				<div>
					<p className={styles.loading}>loading...</p>
				</div>
			) : null}
			{!loading && has_more ? <div ref={setElement}></div> : null}
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
