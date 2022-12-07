import { useEffect, useState } from 'react'

const useIntersectionObserver = ({ root = null, rootMargin = '0px', threshold = 0 }) => {
	const [isIntersecting, setIsIntersecting] = useState(false)
	const [element, setElement] = useState(null)

	useEffect(() => {
		const observer = new IntersectionObserver(([entries]) => setIsIntersecting(entries.isIntersecting), {
			root,
			rootMargin,
			threshold,
		})

		if (element) observer.observe(element)

		return () => observer.disconnect()
	}, [element, root, rootMargin, threshold])

	return [isIntersecting, setElement]
}

export default useIntersectionObserver
