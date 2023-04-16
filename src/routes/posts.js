import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../utils/auth'
import { useNavigate, Link } from 'react-router-dom'

export default function PostsRoute() {
	const [ list, setList ] = useState([])
	const [ loading, setLoading ] = useState(false)
	const [ error, setError ] = useState('')
	const profile = useAuth()
	const navigate = useNavigate()

	useEffect(() => {
		setLoading(true)
		axios.get('/api/posts/').then(res => {
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
			):(list.map((i, ii) => (
				<Link className="post-item-outer" to={"/post/"+i._id} key={ii+'_'}>
					<div className="post-owner">
						<div className="post-owner-dp dp">
							<img />
						</div>
						<div className="post-owner-data">
							{i.owner || '[No Owner]'}
						</div>
					</div>
					<div className="post-item-content">
						<div className="post-item-title">{i.title}</div>
						<div className="post-item-description">{i.description}</div>
					</div>
				</Link>
			)))}
		</div>
	)
}
