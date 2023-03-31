import { useState } from 'react'
import { Form, Link } from 'react-router-dom'
import { useAuthActions } from '../utils/auth'

export default function LoginRoute() {
	const [ username, setUsername ] = useState('')
	const [ password, setPassword ] = useState('')
	const [ loading, setLoading ] = useState(false)
	const { login } = useAuthActions()
	const onLoginPress = () => {
		setLoading(true)
		login(username, password).then(e => {
			setLoading(false)
			if(e) {
				console.error(e)
				alert(e.message+' Try again.')
			}
		}).catch(e => {
			setLoading(false)
			console.error(e)
			alert(e.message+' Try again.')
		})
	}
	return (
		<Form className="form">
			<div className="field">
				<label>Username</label>
				<input onChange={e => setUsername(e.target.value)} value={username} />
			</div>
			<div className="field">
				<label>Password</label>
				<input type="password" onChange={e => setPassword(e.target.value)} value={password} />
			</div>
			<button disabled={loading} onClick={onLoginPress}>LOGIN</button>
			<div className="subtext">Don't have an account? <Link to="/auth/register">Register</Link> now.</div>
		</Form>
	)
}
