import React from 'react'

const allData = new Array(25).fill(0).map((_val, i) => i + 1)

const per_page = 5

const types = {
	start: 'START',
	loaded: 'LOADED',
}

const Reducer = (state, action) => {
	switch (action.type) {
		case 'START':
			return { ...state, loader: true }
		case 'LOADED':
			return {
				...state,
				loader: false,
				has_more: action.newData.length === per_page, // to check if more data exists
				data: [...state.data, ...action.newData], // adding to the data
				after: state.after + state.newData.length, // to keep track of current length
			}
		default:
			throw new Error(`Don't understate the action type`)
	}
}

const Context = React.createContext()

const ContextProvider = ({ children }) => {
	const [state, dispatch] = React.useReducer(Reducer, {
		loader: false,
		has_more: true,
		data: [],
		after: 0,
	})
	const { loader, has_more, data, after } = state

	const load = () => {
		dispatch({ type: types.start })

		setTimeout(() => {
			const newData = allData.slice(after, per_page + after)
			dispatch({ type: types.loaded, newData })
		}, 300)
	}

	return <Context.Provider value={{ loader, has_more, data, after, load }}>{children}</Context.Provider>
}
