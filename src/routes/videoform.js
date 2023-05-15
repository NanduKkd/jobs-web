import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../utils/auth'
import { useNavigate, useParams } from 'react-router-dom'

export default function VideoForm() {
	const [ text, setText ] = useState('')
	const [ duration, setDuration ] = useState('')
	const [ videoUrl, setVideoUrl ] = useState('')
	const [ loading, setLoading ] = useState(false)
	const [ error, setError ] = useState('')
	const profile = useAuth()
	const navigate = useNavigate()

	const params = useParams()
	
	function onSubmitClick() {
		if(!text)
			return setError("Video Text should not be empty")
		if(!duration)
			return setError("Video duration should not be empty")
		if(!videoUrl)
			return setError("Video URL should not be empty")

		axios.post('/api/courses/'+params.courseid+'/video', {text, duration, path: videoUrl, owner: profile._id, course: params.courseid}).then(res => {
			if(res.status===201) {
				navigate('/course/'+params.courseid)
			} else {
				const e = new Error("Something went wrong. Please try again.")
				e.response = res;
				throw e;
			}
		}).catch(e => {
			console.error(e)
			setError(e.message)
		}).then(() => {
			setLoading(false)
		})
		/*
		const file = document.getElementById('selectvideo').files[0]
		if(!file)
			return setError("Video file should be uploaded")

		function getBase64(file) {
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function () {
				const mime = file.type
				const content = reader.result

				setLoading(true)
				setError("")
				axios.post('/api/courses/'+params.courseid+'/video', {text, duration, file: content, owner: profile._id, course: params.courseid}).then(res => {
					if(res.status===201) {
						navigate('/course/'+params.courseid)
					} else {
						const e = new Error("Something went wrong. Please try again.")
						e.response = res;
						throw e;
					}
				}).catch(e => {
					console.error(e)
					setError(e.message)
				}).then(() => {
					setLoading(false)
				})
			};
			reader.onerror = function (error) {
				setError(error.message)
				setLoading(false)
			}
		}
		getBase64(file)
		*/
	}

	return (
		<div className="flex-container">
			<div className="form">
				<div className="field">
					<label>Video Text</label>
					<input value={text} onChange={e => setText(e.target.value)} />
				</div>
				<div className="field">
					<label>Video Duration</label>
					<input value={duration} onChange={e => setDuration(e.target.value)} />
				</div>
				<div className="field">
					<label>Video URL</label>
					<input value={videoUrl} onChange={e => setVideoUrl(e.target.value)} />
				</div>
				{error?<div className="error-label">{error}</div>:null}
				<button disabled={loading} onClick={onSubmitClick}>Upload Video</button>
			</div>
		</div>
	)
}
