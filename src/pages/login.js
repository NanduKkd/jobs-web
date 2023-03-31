function Login() {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	return (
		<div>
			<input onChange={(e) => setUsername(e.target.value)} />
			<input type="password" onChange={(e) => setPassword(e.target.value)} />
			<button onClick={() => login()}>Login</button>
			<div>Don't have an account? <a href="">Create</a> one.</div>
		</div>
	)
}
