import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../utils/auth'
import { useNavigate, useParams } from 'react-router-dom'

export default function AddJob() {
	const [ title, setTitle ] = useState('')
	const [ description, setDescription ] = useState('')
	const [ salaryFrom, setSalaryFrom ] = useState('0')
	const [ salaryTo, setSalaryTo ] = useState('0')
	const [ loading, setLoading ] = useState(false)
	const [ error, setError ] = useState('')
	const profile = useAuth()
	const navigate = useNavigate()

	const params = useParams()

	useEffect(() => {
		if(params?.jobid) {
			setLoading(true)
			axios.get('/api/jobs/'+params.jobid).then(res => {
				if(res.status===200) {
					setTitle(res.data.title)
					setDescription(res.data.description)
					setSalaryFrom(res.data.salary.from+'')
					setSalaryTo(res.data.salary.to+'')
				} else {
					const e = new Error("Something went wrong. Please try again.")
					e.response = res;
					throw e;
				}
			}).catch(e => {
				console.error(e)
				alert(e.message)
				navigate("/jobs")
			}).then(() => {
				setLoading(false)
			})
		}
	}, [params])
	
	function onSubmitClick() {
		if(!title)
			return setError("Job title should be atleast 5 characters of length")
		if(!description)
			return setError("Job description should be atleast 20 characters of length")
		if(!(parseInt(salaryFrom)>0) || !(parseInt(salaryTo)>0) || parseInt(salaryTo)<=parseInt(salaryFrom))
			return setError("Enter valid salary values for the job")

		setLoading(true)
		setError("")
		let promise;
		if(params?.jobid) {
			promise = axios.patch("/api/jobs/"+params.jobid, {title, description, salary: {from: salaryFrom, to: salaryTo}})
		} else {
			promise = axios.post("/api/jobs", {title, description, salary: {from: salaryFrom, to: salaryTo}, recruiter: profile._id})
		}
		promise.then(res => {
			if(res.status===204 && params?.jobid) {
				navigate("/job/"+params.jobid)
			} else if(res.status===201 && !params?.jobid) {
				navigate("/job/"+res.data)
			} else {
				const e = new Error("Something went wrong. Please try again.");
				e.response = res;
			}
		}).catch(e => {
			console.error(e)
			setError(e.message)
		}).then(() => {
			setLoading(false)
		})
	}

	return (
		<div className="flex-container">
			<div className="form">
				<div className="field">
					<label>Job Title</label>
					<input value={title} onChange={e => setTitle(e.target.value)} />
				</div>
				<div className="field">
					<label>Salary</label>
					<div style={{display: 'flex'}}>
						<span style={{fontSize: '0.9em', marginTop: '0.3em', marginRight: '1em'}}>From</span>
						<span style={{fontSize: '1.1em', marginTop: '0.1em'}}>₹</span>
						<input type="number" style={{flex: 1, marginLeft: '0.1em'}} onChange={e => setSalaryFrom(e.target.value)} value={salaryFrom} />
						<span style={{fontSize: '0.9em', marginTop: '0.3em', marginRight: '1em', marginLeft: '1em'}}>To</span>
						<span style={{fontSize: '1.1em', marginTop: '0.1em'}}>₹</span>
						<input type="number" style={{flex: 1, marginLeft: '0.1em'}} onChange={e => setSalaryTo(e.target.value)} value={salaryTo} />
					</div>
				</div>
				<div className="field">
					<label>Job Description</label>
					<textarea onChange={e => setDescription(e.target.value)} value={description}></textarea>
				</div>
				{error?<div className="error-label">{error}</div>:null}
				<button disabled={loading} onClick={onSubmitClick}>{params?.jobid?"Update":"Add"} Job Post</button>
			</div>
		</div>
	)
}
