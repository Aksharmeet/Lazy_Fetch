import { useRef } from 'react'
import { useEffect, useState } from 'react'

const useObserverHook = (options) => {
	const [isIntersecting, setIsIntersecting] = useState(false)
	const [element, setElement] = useState(null)

	const observer = useRef(null)

	const { root = null, rootMargin = '0px', threshold = 0 } = options

	useEffect(() => {
		observer.current = new IntersectionObserver(([entries]) => setIsIntersecting(entries.isIntersecting), {
			root,
			rootMargin,
			threshold,
		})

		const { current: currentObserver } = observer

		if (element) currentObserver.observe(element)

		return () => currentObserver.disconnect()
	}, [element, root, rootMargin, threshold])

	return [isIntersecting, setElement]
}

export default useObserverHook
