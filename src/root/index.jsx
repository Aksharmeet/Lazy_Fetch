import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import InfiniteScroll from 'react-infinite-scroll-component'
import parse from 'html-react-parser'
// styles
import styles from './styles.module.css'

function App() {
	const [userData, setUserData] = useState([])
	const userRef = useRef(0)
	const [visible, setVisible] = useState(false)

	const FetchUserData = async () => {
		userRef.current = userRef.current + 1 //incrementing userRef

		let last_user = userRef.current * 10
		let crr_user = last_user - 9

		for (crr_user; crr_user <= last_user; crr_user++) {
			const fetch_userData_url = `https://jsonplaceholder.typicode.com/posts/${crr_user}`

			try {
				const { data } = await axios.get(fetch_userData_url)

				let gender = crr_user % 2 === 0 ? 'male' : 'female'
				const dicebar_avatar_url = `https://avatars.dicebear.com/api/${gender}/${data.title}.svg`

				const { data: img } = await axios.get(dicebar_avatar_url)
				setUserData((prev) => [...prev, { ...data, img }])
			} catch (err) {
				console.log(err)
			}

			setVisible(false)
		}
	}
	useEffect(() => {
		if (userRef.current === 0) {
			FetchUserData()
		}
	}, [userData, visible])

	return (
		<div className='App'>
			<h1>Request Users</h1>
			<div className={styles.users_cont}></div>

			<InfiniteScroll
				dataLength={userData.length} //required field
				next={userData.length === userRef.current * 10 && FetchUserData} //to ensure that data has been rendered before making a fetch request
				hasMore={userRef.current < 10 ? true : false} //using userRef for checking the actual current fetch user data request
				endMessage={<p style={{ textAlign: 'center' }}>{userData.length === 100 ? <b>Yay! You have seen it all</b> : <b>More data loading</b>}</p>}
			>
				{userData.length > 0
					? userData.map((user) => (
							<div key={user.id}>
								<div>{parse(user.img)}</div>
								<div>
									<p>{user.id}</p>
									<p>{user.title}</p>
									<p>{user.body}</p>
									<p>{user.userId}</p>
								</div>
							</div>
					  ))
					: ''}
			</InfiniteScroll>
		</div>
	)
}

export default App
