import { per_page } from './constants'

export const reducer = (state, action) => {
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
