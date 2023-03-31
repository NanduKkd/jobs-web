import { useState, useEffect, createContext, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const AuthContext = createContext()

export const AuthProvider = ({children}) => {
	const [profile, setProfile] = useState(undefined)
	const [init, setInit] = useState(false)
	const navigate = useNavigate()
	useEffect(() => {
		const localProfile = window.localStorage.getItem('profile')
		axios.get('/api/auth').then(res => {
			if(res.status===200) {
				window.localStorage.setItem('profile', res.data)
				setProfile(res.data)
			} else {
				console.log(res.status)
				throw new Error("Unknown status")
			}
		}).catch(e => {
			console.error(e)
			if(e.response.status===403) {
				window.localStorage.removeItem('profile')
				setProfile(undefined)
				navigate('/error')
			} else {
				navigate('/error')
			}
		}).then(() => {
			setInit(true)
		})
	}, [])

	async function login(username, password) {
		try {
			const res = await axios.get('/api/auth/login', {auth: {username, password}})
			if(res.status===200) {
				setProfile(res.data)
				window.localStorage.setItem('profile', res.data)
			} else {
				throw new Error("Unknown response status")
			}
		} catch(e) {
			console.error(e)
			return {status: e.response?.status, message: e.response?.status===400?'Incorrect username or password.':'Something went wrong.'}
		}
	}

	async function register(data) {
		try {
			const res = await axios.post('/api/auth/register', data)
			if(res.status===201) {
				setProfile(res.data)
				window.localStorage.setItem('profile', res.data)
			} else {
				throw new Error('Unknown response status')
			}
		} catch (e) {
			console.error(e)
			return {status: e.response?.status, message: e.response?.status===400?'Insufficient information.':e.response?.status===409?'Account already exists.':'Something went wrong.'}
		}
	}

	async function logout() {
		try {
			const res = await axios.get('/api/auth/logout')
			if(res.status===204) {
				setProfile(undefined)
				window.localStorage.removeItem('profile')
			} else {
				throw new Error('Unknown response status')
			}
		} catch (e) {
			console.error(e)
			return {status: e.response?.status, message: 'Something went wrong.'}
		}
	}

	return (
		<AuthContext.Provider value={[profile, {register, login, logout}]}>
			{init?(children):(<div className="loader">Loading...</div>)}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	return useContext(AuthContext)[0]
}
export const useAuthActions = () => {
	return useContext(AuthContext)[1]
}
