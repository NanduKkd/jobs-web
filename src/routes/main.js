import { useEffect } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/auth'

export default function MainRoute() {
	const profile = useAuth()
	const navigate = useNavigate()
	useEffect(() => {
		if(!profile) navigate('/auth')
	}, [profile])
	return (
		<>
			<div className="header">
				<div className="logo"></div>
				<div className="spacer" />
				{profile?.role==="recruiter"?<NavLink to="/job/add" className={a => `nav-item ${a.isActive?"active":"inactive"}`}>New Job +</NavLink>:null}
				<NavLink to="/jobs" className={a => `nav-item ${a.isActive?"active":"inactive"}`}>Jobs</NavLink>
				<NavLink to="/chat" className={a => `nav-item ${a.isActive?"active":"inactive"}`}>Chat</NavLink>
				<NavLink to="/myprofile" className={a => `nav-item ${a.isActive?"active":"inactive".isActive?"active":"inactive"}`}>My Profile</NavLink>
			</div>
			<div className="main-content">
				<Outlet />
			</div>
		</>
	)
}
