import React from 'react';
import ReactDOM from 'react-dom/client';
//import { BrowserRouter, Routes, Route, Outlet, Link, Redirect } from 'react-router-dom'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import axios from 'axios'
import './index.css';
import './styles.css'

import { AuthProvider } from './utils/auth'

//import reportWebVitals from './reportWebVitals';

import AuthRoute from './routes/auth'
import MainRoute from './routes/main'
import ChatRoute from './routes/chat'
import JobsRoute from './routes/jobs'
import JobFormRoute from './routes/jobform'
import JobDetailsRoute from './routes/jobdetails'
import MyProfileRoute from './routes/myprofile'
import LoginRoute from './routes/login'
import RegisterRoute from './routes/register'


const router = createBrowserRouter([
	{
		path: "/auth",
		element: <AuthProvider><AuthRoute /></AuthProvider>,
		children: [
			{
				path: "login",
				element: <LoginRoute />,
			},
			{
				path: "register",
				element: <RegisterRoute />,
			},
			{
				path: "",
				element: <Navigate to="/auth/login" replace />,
			},
			{
				path: "*",
				element: <div>404</div>
			}
		]
	},
	{
		path: "/",
		element: <AuthProvider><MainRoute /></AuthProvider>,
		children: [
			{
				path: "jobs",
				element: <JobsRoute />,
			},
			{
				path: "job/add",
				element: <JobFormRoute />,
			},
			{
				path: "job/:jobid",
				element: <JobDetailsRoute />,
			},
			{
				path: "job/edit/:jobid",
				element: <JobFormRoute />,
			},
			{
				path: "user/:profile",
				element: <div>User Profile</div>,
			},
			{
				path: "chat/:profile?",
				element: <ChatRoute />,
			},
			{
				path: "myprofile",
				element: <MyProfileRoute />
			},
			{
				path: "/error",
				element: <div>Error Occurred</div>
			},
			{
				path: "",
				element: <Navigate to="/jobs" replace />,
			},
			{
				path: "*",
				element: <div>404</div>
			}
		]
	},
])

axios.defaults.baseURL = 'http://localhost:3000/'
axios.defaults.withCredentials = true

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
)

/*
function ProtectedRoute ({children}) {
	return (
		<div> Protected Route {children} </div>
	)
}

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<BrowserRouter basename="/">
			<Routes>
				<Route path="auth" element={<AuthRoute />}>
					<Route path="login" element={<div><Outlet />Login</div>} />
					<Route path="register" element={<div>Register</div>} />
					<Redirect from="" to="login" />
				</Route>
				<Route path="" element={<MainRoute />}>
					<Route path="jobs" element={<div>Jobs</div>} />
					<Route path="jobs/:job" element={<div>Job</div>} />
					<Route path="chats/:person?" element={<ChatRoute />} />
				</Route>
			</Routes>
		</BrowserRouter>
	</React.StrictMode>
);
*/
	
//// If you want to start measuring performance in your app, pass a function
//// to log results (for example: reportWebVitals(console.log))
//// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
