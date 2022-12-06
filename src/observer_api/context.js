import { useReducer, useCallback, createContext } from 'react'
import axios from 'axios'
import { per_page, types } from './constants'
import { reducer } from './reducer'

export const Context = createContext()

const ContextProvider = ({ children }) => {
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
	return <Context.Provider value={{ fetch, loading, has_more, data }}>{children}</Context.Provider>
}

export default ContextProvider
