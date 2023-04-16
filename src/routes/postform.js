import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../utils/auth'
import { useNavigate, useParams } from 'react-router-dom'

export default function AddPost() {
	const [ title, setTitle ] = useState('')
	const [ description, setDescription ] = useState('')
	const [ loading, setLoading ] = useState(false)
	const [ error, setError ] = useState('')
	const profile = useAuth()
	const navigate = useNavigate()

	const params = useParams()

	useEffect(() => {
		if(params?.postid) {
			setLoading(true)
			axios.get('/api/posts/'+params.postid).then(res => {
				if(res.status===200) {
					setTitle(res.data.title)
					setDescription(res.data.description)
				} else {
					const e = new Error("Something went wrong. Please try again.")
					e.response = res;
					throw e;
				}
			}).catch(e => {
				console.error(e)
				alert(e.message)
				navigate("/posts")
			}).then(() => {
				setLoading(false)
			})
		}
	}, [params])
	
	function onSubmitClick() {
		if(!title)
			return setError("Post title should be atleast 5 characters of length")
		if(!description)
			return setError("Post description should be atleast 20 characters of length")

		setLoading(true)
		setError("")
		let promise;
		if(params?.postid) {
			promise = axios.patch("/api/posts/"+params.postid, {title, description})
		} else {
			promise = axios.post("/api/posts", {title, description, owner: profile._id})
		}
		promise.then(res => {
			if(res.status===204 && params?.postid) {
				navigate("/post/"+params.postid)
			} else if(res.status===201 && !params?.postid) {
				navigate("/post/"+res.data)
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
					<label>Post Title</label>
					<input value={title} onChange={e => setTitle(e.target.value)} />
				</div>
				<div className="field">
					<label>Post Description</label>
					<textarea onChange={e => setDescription(e.target.value)} value={description}></textarea>
				</div>
				{error?<div className="error-label">{error}</div>:null}
				<button disabled={loading} onClick={onSubmitClick}>{params?.postid?"Update":"Add"} Post Post</button>
			</div>
		</div>
	)
}
