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
	const [letter, setLetter] = useState('')
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
	function onCancelClick() {
		setApplying(false)
	}
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
	function onEditClick() {
		navigate("/job/edit/"+params?.jobid)
	}
	function onDeleteClick() {
		if(window.confirm("Are you sure to delete this job? This action can't be reversed.")) {
			setLoading(true)
			axios.delete('/api/jobs/'+params?.jobid).then(res => {
				if(res.status===204) {
					navigate("/jobs")
				} else {
					const e = new Error("Something went wrong. Please try again.")
					e.response = res;
					throw e;
				}
			}).catch(e => {
				console.error(e)
				alert(e.message)
			}).then(() => {
				setLoading(false);
			})
		}
	}
	return (
		<div className="scroll-container">
			<div className="card">
				<h1 className="title">{title}</h1>
				<div className="salary">Salary: ₹{salary.from} - ₹{salary.to}</div>
			</div>
			<div className="card">
				<div className="description">{description}</div>
			</div>
			<div className="card">
				{profile.role==="user" && !applying?(
					<div style={{display: 'flex'}}>
						<button onClick={onApplyClick}>Apply for this Job</button>
						<div style={{width: '10px'}} />
						<button>Bookmark this job</button>
					</div>
				):(
					<div style={{display: 'flex'}}>
						<button onClick={onEditClick}>Edit job details</button>
						<div style={{width: '10px'}} />
						<button className="danger" onClick={onDeleteClick}>Delete this job</button>
					</div>
				)}
				{applying?(
					<div className="card-form">
						<label>Request Letter</label>
						<textarea onChange={e => setLetter(e.target.value)} value={letter} placeholder='Enter a request letter to apply for this job'></textarea>
						<button disabled={loading} onClick={sendRequest}>Send Message to Recruiter</button>
						<button className="cancel" disabled={loading} onClick={onCancelClick}>Cancel</button>
					</div>
				):null}
			</div>
			<div style={{height: '2em'}} />
		</div>
	)
}
