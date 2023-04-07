import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../utils/auth'
import { useNavigate, Link } from 'react-router-dom'

export default function JobsRoute() {
	const [ list, setList ] = useState([])
	const [ loading, setLoading ] = useState(false)
	const [ error, setError ] = useState('')
	const profile = useAuth()
	const navigate = useNavigate()

	useEffect(() => {
		setLoading(true)
		axios.get(profile.role==='recruiter'?'/api/jobs/recruiter/'+profile._id:'/api/jobs/').then(res => {
			setError('')
			setList(res.data)
			console.log(res.data)
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
			):(list.map((i, ii) => (
				<Link className="job-item-outer" to={"/job/"+i._id} key={ii+'_'}>
					<div className="job-item-title">{i.title}</div>
					<div className="job-item-salary">₹{i.salary.from} - ₹{i.salary.to}</div>
					<div className="job-item-description">{i.description}</div>
				</Link>
			)))}
		</div>
	)
}
