import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../utils/auth'
import { useNavigate, Link, useParams } from 'react-router-dom'

export default function JobsRoute() {
	const [ data, setData ] = useState(null)
	const [ loading, setLoading ] = useState(false)
	const [ error, setError ] = useState('')
	const profile = useAuth()
	const navigate = useNavigate()
	const params = useParams()

	function editVideo(vid) {
		const text = window.prompt("Enter a new name for the video")
		axios.patch('/api/courses/'+params.courseid+'/'+vid, {text}).then(res => {
			if(res.status===204) {
				setData(d => {
					const v = [...data.videos]
					const ind = v.findIndex(i => i._id===vid)
					v[ind] = {...v[ind], text}
					return {...data, videos: v}
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
	function deleteVideo(vid) {
		axios.delete('/api/courses/'+params.courseid+'/'+vid).then(res => {
			if(res.status===204) {
				setData(d => {
					const v = [...data.videos]
					v.splice(v.findIndex(i => i._id===vid), 1)
					return {...data, videos: v}
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
		axios.get('/api/courses/'+params.courseid).then(res => {
			setError('')
			setData(res.data)
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
			):data?(
				<div className="card">
					<div className="course-header">
						<h1 className="title">{data.title}</h1>
						<div className="subtitle">
							By {data.owner.name}
							&nbsp;&nbsp;•&nbsp;&nbsp;{data.videos.length} videos
							{data.owner._id===profile._id?
								<>&nbsp;&nbsp;•&nbsp;&nbsp;<Link to={"/course/"+params.courseid+"/newvideo"}>New Video +</Link></>
							:null}
						</div>
					</div>
					{data.videos.map((i, ii) => (
						<div className="video-item-outer" key={ii+'_'}>
							<svg className="video-item-play" viewBox="0 0 200 200">
				                <polygon points="0 40 100 100 0 160"></polygon>
							</svg>
							<div className="video-item-duration">({i.duration})</div>
							<a href={i.path} target="_blank" className="video-item-text">{i.text}</a>
							<div className="spacer" />
						{profile.role==='tutor'?
							<>
							<div className="video-item-action" onClick={() => editVideo(i._id)}>
								<svg className="video-item-action-icon" viewBox="0 0 24 24" fill="none">
									<path id="Vector" d="M12 8.00012L4 16.0001V20.0001L8 20.0001L16 12.0001M12 8.00012L14.8686 5.13146L14.8704 5.12976C15.2652 4.73488 15.463 4.53709 15.691 4.46301C15.8919 4.39775 16.1082 4.39775 16.3091 4.46301C16.5369 4.53704 16.7345 4.7346 17.1288 5.12892L18.8686 6.86872C19.2646 7.26474 19.4627 7.46284 19.5369 7.69117C19.6022 7.89201 19.6021 8.10835 19.5369 8.3092C19.4628 8.53736 19.265 8.73516 18.8695 9.13061L18.8686 9.13146L16 12.0001M12 8.00012L16 12.0001" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>
							</div>
							<div onClick={() => deleteVideo(i._id)} className="video-item-action">
								<svg className="video-item-action-icon" viewBox="0 0 24 24" fill="none">
									<path d="M10 12V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
									<path d="M14 12V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
									<path d="M4 7H20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
									<path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
									<path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>
							</div>
							</>
								:null}
						</div>
					))}
				</div>
			):null}
		</div>
	)
}
