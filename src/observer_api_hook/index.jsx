import React, { useEffect } from 'react'
import useIntersectionObserver from './useIntersectionObserver'

function Index() {
	const [isIntersecting, setElement] = useIntersectionObserver({ root: null, threshold: 0.5 })

	useEffect(() => {
		console.log(isIntersecting)
	}, [isIntersecting])

	return <div ref={setElement}>observer_hook</div>
}

export default Index
