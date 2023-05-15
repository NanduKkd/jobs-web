import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

export default function VideoRoute() {
	const params = useParams()
	/*
	useEffect(() => {
		if(params.videoid) {
			axios.get('/api/courses/'+params.courseid+'/'+params.videoid).then(res => {
				if(res.status===200) {
					const videopath
				} else {
					console.log(res.status)
					throw new Error("Something went wrong. Please try again.")
				}
			}).catch(e => {
				console.error(e)
				alert(e.message)
			})
		}
	}, [params])
	*/
	return (
		<video width="300px" controls>
			<source src={"http://localhost:3000/api/courses/"+params.courseid+"/"+params.videoid} type="video/mp4" />
			Your browser does not support the video tag.
		</video>
	)
}
