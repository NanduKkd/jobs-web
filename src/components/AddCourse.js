import axios from 'axios'
import { useAuth } from '../utils/auth'
import { useNavigate } from 'react-router-dom'

export default function AddCourse() {
	const profile = useAuth()
	const navigate = useNavigate()
	function onAddClick() {
		const title = window.prompt("Enter a title for the New Course:")
		axios.post('/api/courses/', {title, owner: profile._id}).then(res => {
			if(res.status===201) {
				navigate("/job/"+res.data)
			} else {
				const e = new Error("Something went wrong. Please try again.");
				e.response = res;
			}
		}).catch(e => {
			console.error(e)
			alert(e.message)
		})
	}
	return (
		<div className="nav-item" onClick={onAddClick}>New Course +</div>
	)
}
