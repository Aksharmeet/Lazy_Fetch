import { useRef } from 'react'
import { useEffect, useState } from 'react'

const useIntersect = ({ root = null, rootMargin, threshold }) => {
	const [entry, updateEntry] = useState({})
	const [node, setNode] = useState(null)

	const observer = useRef(null)
	useEffect(() => {
		observer.current = new IntersectionObserver(([entry]) => updateEntry(entry), {
			root,
			rootMargin,
			threshold,
		})

		const { current: currentObserver } = observer

		if (node) currentObserver.observe(node)

		return () => currentObserver.disconnect()
	}, [node, root, rootMargin, threshold])

	return [entry, setNode]
}

export default useIntersect
