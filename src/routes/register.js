import { useState } from 'react'
import { Form, Link } from 'react-router-dom'
import { useAuthActions } from '../utils/auth'

export default function RegisterRoute() {
	const { register } = useAuthActions()
	const [ name, setName ] = useState('')
	const [ phone, setPhone ] = useState('')
	const [ email, setEmail ] = useState('')
	const [ role, setRole ] = useState('')
	const [ username, setUsername ] = useState('')
	const [ password, setPassword ] = useState('')
	const [ confirm, setConfirm ] = useState('')
	const [ loading, setLoading ] = useState(false)
	const [ error, setError ] = useState(null)
	const onRegisterClick = () => {
		if(!name.length)
			return setError("Please enter your name.")
		if(!/^\d{10}$/.test(phone))
			return setError("Please enter a valid phone number.")
		if(!/^[a-zA-Z0-9\._]+@[a-zA-Z0-9_]+\.[a-z]{2,}$/.test(email))
			return setError("Please enter a valid email address.")
		if(!username.length)
			return setError("Please enter a username.")
		if(password.length<6)
			return setError("Please enter a password that is atleast 6 characters long.")
		if(password !== confirm)
			return setError("Passwords does not match.")
		setLoading(true)
		register({role, name, phone, email, username, password}).then(e => {
			if(e) {
				console.error(e)
				setLoading(false)
				setError(e.message)
			}
		})
	}
	return (
		<Form className="form">
			<div className="field">
				<label>Name</label>
				<input value={name} onChange={e => setName(e.target.value)} />
			</div>
			<div className="field">
				<label>Phone</label>
				<input type="phone" value={phone} onChange={e => setPhone(e.target.value)} />
			</div>
			<div className="field">
				<label>Email address</label>
				<input type="email" value={email} onChange={e => setEmail(e.target.value)} />
			</div>
			<div className="field">
				<label>What are you?</label>
				<div style={{display: 'flex', marginTop: '0.5em'}}>
					<input style={{width: '1em', height: '1em', marginRight: '0.4em'}} type="radio" checked={role==='user'} onClick={e => setRole('user')} />
					<label style={{marginTop: '0.1em'}}>User</label>
					<input style={{width: '1em', height: '1em', marginRight: '0.4em', marginLeft: '1.5em'}} type="radio" checked={role==='recruiter'} onClick={e => setRole('recruiter')} />
					<label style={{marginTop: '0.1em'}}>Recruiter</label>
					<input style={{width: '1em', height: '1em', marginRight: '0.4em', marginLeft: '1.5em'}} type="radio" checked={role==='tutor'} onClick={e => setRole('tutor')} />
					<label style={{marginTop: '0.1em'}}>Tutor</label>
				</div>
			</div>
			<div className="field">
				<label>Username</label>
				<input value={username} onChange={e => setUsername(e.target.value)} />
			</div>
			<div className="field">
				<label>Password</label>
				<input type="password" value={password} onChange={e => setPassword(e.target.value)} />
			</div>
			<div className="field">
				<label>Confirm Password</label>
				<input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} />
			</div>
			{error?<div className="error-label">{error}</div>:null}
			<button onClick={onRegisterClick} disabled={loading}>Register</button>
			<div className="subtext">Already have an account? <Link to="/auth/login">Login</Link> now.</div>
		</Form>
	)
}
