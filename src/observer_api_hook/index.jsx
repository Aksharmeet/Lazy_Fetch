import React, { useEffect } from 'react'
import useObserverHook from './useObserverHook'

function Index() {
	const [isIntersecting, setElement] = useObserverHook({ root: null, threshold: 0.5 })

	useEffect(() => {
		console.log(isIntersecting)
	}, [isIntersecting])

	return <div ref={setElement}>observer_hook</div>
}

export default Index
