import { useEffect, useState, useRef } from 'react'
import axios from 'axios'

// styles
import styles from './styles.module.css'

function App() {
	const [userData, setUserData] = useState([])
	const userRef = useRef(0)

	const FetchUserData = async (num) => {
		let last_user = num * 10
		let get_user = last_user - 9
		for (get_user; get_user <= last_user; get_user++) {
			const fetch_userData_url = `https://jsonplaceholder.typicode.com/posts/${get_user}`
			try {
				const { data } = await axios.get(fetch_userData_url)
				setUserData((prev) => [...prev, data])
			} catch (err) {
				console.log(err)
			}
		}
	}
	useEffect(() => {
		// to control the renders.
		// the variables can't be used as the assignment to the variables inside the hook will be lost on every render.
		// state can't be used as they show the previous value till the dom is renderd which is too late.
		// hence, useRef cam out at top for showing true current state of the app

		if (userRef.current === 0) {
			FetchUserData(1)
			userRef.current = 1
		}

		let options = {
			// root: null,
			// rootMargin: '0px',
			// threshold: 1.0,
		}

		let callback = (entries, observer) => {
			entries.forEach((entry, i) => {
				console.log(entry.isIntersecting)
			})
		}

		let observer = new IntersectionObserver(callback, options)
		const intersecting_div = document.getElementById('intersector')
		observer.observe(intersecting_div)
	}, [userData])

	return (
		<div className='App'>
			<h1>Request Users</h1>
			<div className={styles.users_cont}>
				{userData.length > 0
					? userData.map((user) => (
							<div key={user.id}>
								<p>{user.id}</p>
								<p>{user.title}</p>
								<p>{user.body}</p>
								<p>{user.userId}</p>
							</div>
					  ))
					: ''}
			</div>
			<div id='intersector'></div>
		</div>
	)
}

export default App
