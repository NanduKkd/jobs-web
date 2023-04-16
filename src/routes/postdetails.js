import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../utils/auth'

export default function PostDetails() {
	const profile = useAuth()
	const params = useParams();
	const navigate = useNavigate()
	const [title, setTitle] = useState('Post title...')
	const [description, setDescription] = useState('Post description...')
	const [owner, setOwner] = useState('')
	const [ownerName, setOwnerName] = useState('')

	const [letter, setLetter] = useState('')
	const [replying, setReplying] = useState(false)
	const [loading, setLoading] = useState(false)
	
	useEffect(() => {
		if(!params?.postid) {
			navigate("/posts")
		} else {
			axios.get('/api/posts/'+params.postid).then(res => {
				if(res.status===200) {
					setTitle(res.data.title)
					setDescription(res.data.description)
					setOwner(res.data.owner._id)
					setOwnerName(res.data.owner.name)
				} else {
					const e = new Error("Somethig went wrong. Please try again later.")
					e.response = res;
					throw e;
				}
			}).catch(e => {
				console.error(e)
				alert(e.message)
				navigate("/posts")
			})
		}
	}, [params])
	function onCancelClick() {
		setReplying(false)
	}
	function onReplyClick() {
		setReplying(true)
	}
	function sendRequest() {
		setLoading(true)
		axios.post("/api/messages/", {to: owner, from: profile._id, text: letter}).then(res => {
			if(res.status===201) {
				navigate("/chat/"+owner)
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
		navigate("/post/edit/"+params?.postid)
	}
	function onDeleteClick() {
		if(window.confirm("Are you sure to delete this post? This action can't be reversed.")) {
			setLoading(true)
			axios.delete('/api/posts/'+params?.postid).then(res => {
				if(res.status===204) {
					navigate("/posts")
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
				<div className="post-owner">
					<div className="post-owner-dp dp">
						<img />
					</div>
					<div className="post-owner-data">
						{ownerName?ownerName:owner}
					</div>
				</div>
				<div style={{height: '1em'}} />
				<h1 className="title">{title}</h1>
				<div className="description">{description}</div>
			</div>
			<div className="card">
				{profile._id===owner?(
					<div style={{display: 'flex'}}>
						<button onClick={onEditClick}>Edit post details</button>
						<div style={{width: '10px'}} />
						<button className="danger" onClick={onDeleteClick}>Delete this post</button>
					</div>
				):!replying?(
					<div style={{display: 'flex'}}>
						<button onClick={onReplyClick}>Send a reply to this Post</button>
						{/*
						<div style={{width: '10px'}} />
						<button>Bookmark this Post</button>
						*/}
					</div>
				):(
					<div className="card-form">
						<label>Request Letter</label>
						<textarea onChange={e => setLetter(e.target.value)} value={letter} placeholder='Enter a reply this post'></textarea>
						<button disabled={loading} onClick={sendRequest}>Send Message to Post Owner</button>
						<button className="cancel" disabled={loading} onClick={onCancelClick}>Cancel</button>
					</div>
				)}
			</div>
			<div style={{height: '2em'}} />
		</div>
	)
}
