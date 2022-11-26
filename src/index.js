import React from 'react'
import ReactDOM from 'react-dom/client'

// components
// import App from './root'
import App from './observer_api'

// styles
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
)
