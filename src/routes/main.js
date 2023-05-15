import { useEffect } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/auth'
import AddCourse from '../components/AddCourse'

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
				<NavLink to="/post/add" className={a => `nav-item ${a.isActive?"active":"inactive"}`}>New Post +</NavLink>
				<NavLink to="/posts" className={a => `nav-item ${a.isActive?"active":"inactive"}`}>Posts</NavLink>
				{profile?.role==="tutor"?<AddCourse />:null}
				<NavLink to="/courses" className={a => `nav-item ${a.isActive?"active":"inactive"}`}>{profile?.role==="tutor"?"My ":""}Courses</NavLink>
				{profile?.role==="recruiter"?<NavLink to="/job/add" className={a => `nav-item ${a.isActive?"active":"inactive"}`}>New Job +</NavLink>:null}
				<NavLink to="/jobs" className={a => `nav-item ${a.isActive?"active":"inactive"}`}>{profile?.role==="recruiter"?"My ":""}Jobs</NavLink>
				<NavLink to="/chat" className={a => `nav-item ${a.isActive?"active":"inactive"}`}>Chat</NavLink>
				<NavLink to="/myprofile" className={a => `nav-item ${a.isActive?"active":"inactive"}`}>My Profile</NavLink>
			</div>
			<div className="main-content">
				<Outlet />
			</div>
		</>
	)
}
