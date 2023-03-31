import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/auth'

export default function AuthRoute() {
	const profile = useAuth()
	const navigate = useNavigate()
	useEffect(() => {
		if(profile) navigate('/')
	}, [profile])
	return (
		<div className="flex-container">
			<Outlet />
		</div>
	)
}
