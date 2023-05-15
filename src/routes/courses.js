import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../utils/auth'
import { useNavigate, useParams, Link } from 'react-router-dom'

export default function JobsRoute() {
	const [ list, setList ] = useState([])
	const [ loading, setLoading ] = useState(false)
	const [ error, setError ] = useState('')
	const profile = useAuth()
	const navigate = useNavigate()

	function editCourse(courseid) {
		const title = window.prompt("Enter a new title for the course")
		axios.patch('/api/courses/'+courseid, {title}).then(res => {
			if(res.status===204) {
				setList(c => {
					c = [...c]
					const ind = c.findIndex(i => i._id===courseid)
					c[ind] = {...c[ind], title}
					return c
				})
			} else {
				console.log(res.status);
				throw new Error("Something went wrong. Please try again.")
			}
		}).catch(e => {
			console.error(e)
			alert(e.message)
		})
	}
	function deleteCourse(courseid) {
		axios.delete('/api/courses/'+courseid).then(res => {
			if(res.status===204) {
				setList(c => {
					c = [...c]
					const ind = c.findIndex(i => i._id===courseid)
					c.splice(ind, 1)
					return c
				})
			} else {
				console.log(res.status);
				throw new Error("Something went wrong. Please try again.")
			}
		}).catch(e => {
			console.error(e)
			alert(e.message)
		})
	}
	useEffect(() => {
		setLoading(true)
		axios.get(profile.role==='tutor'?'/api/courses/tutor/'+profile._id:'/api/courses/').then(res => {
			setError('')
			setList(res.data)
		}).catch(e => {
			setError(e.message)
			console.error(e)
		}).then(() => {
			setLoading(false)
		})
	}, [profile])
	return (
		<div className="scroll-container">
			{error?(
				<div className="error-label">{error}</div>
			):list.map((i, ii) => (
				<div className="course-item-outer card" key={ii+'_'}>
					<div className="course-item-thumbnail">[Thumbnail Image]</div>
					<div className="course-item-body">
						<Link to={"/course/"+i._id}>
							<h2 style={{margin: '0 0 0.2em 0'}} className="title">{i.title}</h2>
						</Link>
						<div className="course-item-subtitle">{i.owner}</div>
						{profile.role==='tutor'?
						<div className="course-item-actions">
							<div className="video-item-action" onClick={() => editCourse(i._id)}>
								<svg className="video-item-action-icon" viewBox="0 0 24 24" fill="none">
									<path id="Vector" d="M12 8.00012L4 16.0001V20.0001L8 20.0001L16 12.0001M12 8.00012L14.8686 5.13146L14.8704 5.12976C15.2652 4.73488 15.463 4.53709 15.691 4.46301C15.8919 4.39775 16.1082 4.39775 16.3091 4.46301C16.5369 4.53704 16.7345 4.7346 17.1288 5.12892L18.8686 6.86872C19.2646 7.26474 19.4627 7.46284 19.5369 7.69117C19.6022 7.89201 19.6021 8.10835 19.5369 8.3092C19.4628 8.53736 19.265 8.73516 18.8695 9.13061L18.8686 9.13146L16 12.0001M12 8.00012L16 12.0001" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>
							</div>
							<div onClick={() => deleteCourse(i._id)} className="video-item-action">
								<svg className="video-item-action-icon" viewBox="0 0 24 24" fill="none">
									<path d="M10 12V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
									<path d="M14 12V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
									<path d="M4 7H20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
									<path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
									<path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>
							</div>
						</div>
						:null}
					</div>
				</div>
			))}
		</div>
	)
}
