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
	if(!profile) return null
	return (
		<div className="scroll-container">
			<div className="card">
				<h1>My Profile</h1>
				Name: {profile.name}<br />
				Email: {profile.email}<br />
				Phone: {profile.phone}<br />
				Role: {profile.role==="recruiter"?"Recruiter":"User"}<br />
			</div>
			<div className="card">
				<button className="danger" onClick={onLogoutClick} disabled={loading}>Logout</button>
			</div>
		</div>
	)
}
