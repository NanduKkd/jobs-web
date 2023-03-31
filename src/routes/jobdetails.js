import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../utils/auth'

export default function JobDetails() {
	const profile = useAuth()
	const params = useParams();
	const navigate = useNavigate()
	const [title, setTitle] = useState('Job title...')
	const [description, setDescription] = useState('Job description...')
	const [salary, setSalary] = useState(0)
	const [recruiter, setRecruiter] = useState('')

	const [applying, setApplying] = useState(false)
	const [letter, setLetter] = useState('Enter a request letter to apply for this job')
	const [loading, setLoading] = useState(false)
	
	useEffect(() => {
		if(!params?.jobid) {
			navigate("/jobs")
		} else {
			axios.get('/api/jobs/'+params.jobid).then(res => {
				if(res.status===200) {
					setTitle(res.data.title)
					setDescription(res.data.description)
					setSalary(res.data.salary)
					setRecruiter(res.data.recruiter)
				} else {
					const e = new Error("Somethig went wrong. Please try again later.")
					e.response = res;
					throw e;
				}
			}).catch(e => {
				console.error(e)
				alert(e.message)
				navigate("/jobs")
			})
		}
	}, [params])
	function onApplyClick() {
		setApplying(true)
	}
	function sendRequest() {
		setLoading(true)
		axios.post("/api/messages/", {to: recruiter, from: profile._id, text: letter}).then(res => {
			if(res.status===201) {
				navigate("/chat/"+recruiter)
			} else {
				const e = new Error("Something went wrong. Please try again.")
				e.response = res;
				throw e;
			}
		}).catch(e => {
			alert(e.message)
		}).then(() => {
			setLoading(false)
		})
	}
	return (
		<div>
			<h2 className="title">{title}</h2>
			<div className="salary">Salary {salary}</div>
			<div className="description">{description}</div>
			{profile.role==="user" && !applying?(
				<button onClick={onApplyClick}>Apply for Job</button>
			):null}
			{applying?(
				<>
					<label>Request Letter</label>
					<textarea onChange={e => setLetter(e.target.value)} value={letter}></textarea>
					<button disabled={loading} onClick={sendRequest}>Send Request</button>
				</>
			):null}
		</div>
	)
}
