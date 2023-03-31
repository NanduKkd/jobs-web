import { useState } from 'react'
import { useAuth, useAuthActions } from '../utils/auth'

export default function MyProfileRoute() {
	const profile = useAuth()
	const { logout } = useAuthActions()
	const [loading, setLoading] = useState(false)
	function onLogoutClick() {
		setLoading(true)
		logout().then(e => {
			if(e) throw e;
		}).catch(e => {
			console.error(e)
			setLoading(false)
			alert(e.message+" Please try again.")
		})
	}
	return (
		<>
			<h2>My Profile</h2>
			<button onClick={onLogoutClick} disabled={loading}>Logout</button>
		</>
	)
}
