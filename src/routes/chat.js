import { useEffect, useState, useRef, useMemo } from 'react'
import { Outlet, NavLink, useParams } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../utils/auth'

export default function ChatRouter() {
	const params = useParams()
	const profile = useAuth()
	const [data, setData] = useState({state: undefined, chats: []})
	const [socketStatus, setSocketStatus] = useState('loading')
	const [timeGap, setTimeGap] = useState(0)
	const [msgInput, setMsgInput] = useState('')
	const ws = useRef()
	const crntChat = useMemo(() => {
		if(params.profile && data.status==='loaded') {
			const thisChat = data.chats.find(i => i._id===params.profile)
			if(thisChat.status==='loaded') {
				let _msgs = [], alertCount=0;
				let lastDate = null, thisDate;
				for(let i of thisChat.messages) {
					thisDate = new Date(new Date(i.createdAt).getTime()-timeGap)
					if(thisDate.getFullYear()!==lastDate?.getFullYear() || thisDate.getMonth()!==lastDate?.getMonth() || thisDate.getDate()!==lastDate?.getDate()) {
						if(lastDate) _msgs.push({type: 'date', date: showDate(lastDate)})
						lastDate = thisDate;
					}
					if(i.from!==profile._id && !i.seen) {
						alertCount++;
					}
					_msgs.push({type: 'msg', ...i, createdAt: showTime(new Date(new Date(i.createdAt).getTime()-timeGap))})
				}
				if(lastDate) _msgs.push({type: 'date', date: showDate(lastDate), alertCount})
				return {...thisChat, messages: _msgs, alertCount}
			}
		}
		return null;
	}, [data, params, timeGap, profile])
	function sendJSON(object) {
		ws.current.send(JSON.stringify(object))
	}
	useEffect(() => {
		const _ws = new WebSocket('ws://localhost:3000/socket/')
		ws.current = _ws;
		_ws.onopen = () => {
			sendJSON({type: 'time', time: Date.now()})
		}
		_ws.onclose = () => {
			setSocketStatus('closed')
		}
		_ws.onmessage = msg => {
			msg = JSON.parse(msg.data)
			console.log('message came', msg)
			const now = Date.now()
			switch(msg.type) {
				case 'start':
					setSocketStatus('live')
					break;
				case 'time':
					setTimeGap(msg.middle - (msg.start+now)/2);
					break;
				case 'message':
					addMessage(msg.message)
					break;
				case 'sent':
					addMessage(msg.message)
					break;
				case 'seen':
					messageSeen(msg.chat)
					break;
			}
		}
		return () => _ws.close()
	}, [])


	function sendMessage() {
		sendJSON({type: 'message', chat: params.profile, text: msgInput})
		setMsgInput("")
	}
	function onKeyDown(e) {
		if(e.code==="Enter" && e.ctrlKey) sendMessage();
	}
	useEffect(() => {
		if(!data.status) {
			setData({status: 'loading', chats: []})
			axios.get("/api/messages/"+profile._id).then(res => {
				if(res.status===200) {
					setData({
						status: 'loaded',
						chats: res.data.map(i => ({
							_id: i._id,
							name: i.otherPerson?.name,
							alertCount: i.alertCount,
							messages: [{
								_id: i.messageid,
								text: i.text,
								createdAt: i.createdAt,
								seen: i.seenAt?true:false,
								from: i.from,
							}],
						}))
					})
				} else {
					const e = new Error("Something went wrong. Please try again.")
					e.response = res;
					throw e;
				}
			}).catch(e => {
				alert(e.message)
			})
		} else if(data.status==='loaded') {
			if(params?.profile) {
				const chatProfile = data.chats.find(i => i._id===params.profile)
				if(chatProfile && !chatProfile.status) {
					setData(d => {
						d = {status: 'loaded', chats: [...d.chats]}
						for(let i in d.chats) {
							const chat = d.chats[i]
							if(chat._id===params.profile) {
								d.chats[i] = {...chat, status: 'loading'}
								break;
							}
						}
						return d;
					})
					axios.get('/api/messages/'+profile._id+'/'+params.profile).then(res => {
						setData(d => {
							d = {status: 'loaded', chats: [...d.chats]}
							for(let i in d.chats) {
								const chat = d.chats[i]
								if(chat._id===params.profile) {
									d.chats[i] = {...chat, status: 'loaded', messages: res.data.messages, alertCount: 0}
									break;
								}
							}
							return d;
						})
						sendJSON({type: 'message_seen', chat: params.profile})
					})
				} else if(chatProfile && chatProfile.status==='loaded') {
					if(chatProfile.messages.find(i => i.from===params.profile && !i.seenAt)) {
						sendJSON({type: 'message_seen', chat: params.profile})
					}
				}
			}
		}
	}, [params, data])

	function addMessage(msg) {
		setData(c => {
			c = {...c, chats: [...c.chats]};
			for(let i in c.chats) {
				const chat = c.chats[i]
				if(chat._id===msg.chat) {
					c.chats[i] = {
						...chat,
						messages: [
							{
								text: msg.text,
								createdAt: msg.createdAt,
								seen: msg.seenAt?true:false,
								from: msg.from
							},
							...chat.messages
						],
						alertCount: params.profile!==msg.from
							&& profile._id!==msg.from
							?chat.alertCount+1
							:chat.alertCount
					}
					break;
				}
			}
			return c;
		})
	}
	function messageSeen(seenChat, bySelf=false) {
		console.log('messageSeen called', seenChat, bySelf)
		setData(c => {
			c = {...c, chats: [...c.chats]};
			console.log('0')
			for(let i in c.chats) {
				console.log('1', i)
				const chat = c.chats[i]
				if(chat._id===seenChat) {
					console.log('2')
					c.chats[i] = {...chat, messages: [...chat.messages], alertCount: bySelf?0:chat.alertCount}
					for(let j in c.chats[i].messages) {
						const msg = c.chats[i].messages[j]
						console.log('3', j)
						if(msg.seen) break;
						else if(bySelf!==(msg.from===profile._id)) {
							console.log('4', msg.text)
							c.chats[i].messages[j] = {...msg, seen: true}
						}
					}
					console.log('5')
					break;
				}
			}
			return c;
		})
	}

	return (
		<div className="chat-container">
			<div className="chats">
				{data.chats?.map(i => (
					<NavLink className={a => `chats-item ${a.isActive?"active":"inactive"}`} to={"/chat/"+i._id} key={i._id}>
						<div className="chats-dp">
							<img src="" />
						</div>
						<div className="chats-content">
							<div className="chats-title">{i.name}</div>
							<div className="chats-subtitle">
										{i.messages[0].from===profile._id?<div className="msg-status">{i.messages[0].seen?

											<svg width="1.4em" height="1.2em" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
												<g clip-path="url(#clip0_949_23339)">
													<path d="M17.5821 6.95711C17.9726 6.56658 17.9726 5.93342 17.5821 5.54289C17.1916 5.15237 16.5584 5.15237 16.1679 5.54289L5.54545 16.1653L1.70711 12.327C1.31658 11.9365 0.683417 11.9365 0.292893 12.327C-0.0976311 12.7175 -0.097631 13.3507 0.292893 13.7412L4.83835 18.2866C5.22887 18.6772 5.86204 18.6772 6.25256 18.2866L17.5821 6.95711Z" fill="#34b7f1"/>
													<path d="M23.5821 6.95711C23.9726 6.56658 23.9726 5.93342 23.5821 5.54289C23.1915 5.15237 22.5584 5.15237 22.1678 5.54289L10.8383 16.8724C10.4478 17.263 10.4478 17.8961 10.8383 18.2866C11.2288 18.6772 11.862 18.6772 12.2525 18.2866L23.5821 6.95711Z" fill="#34b7f1"/>
												</g>
												<defs>
													<clipPath id="clip0_949_23339">
														<rect width="24" height="24" fill="white"/>
													</clipPath>
												</defs>
											</svg>
										:
											<svg width="1.4em" height="1.2em" viewBox="0 0 20 20" fill="none">
<path fill-rule="evenodd" clip-rule="evenodd" d="M9.9647 14.9617L17.4693 7.44735L18.5307 8.50732L9.96538 17.0837L5.46967 12.588L6.53033 11.5273L9.9647 14.9617Z" fill="#1F2328"/>
</svg>
}</div>:null}
								{i.messages[0].text}
							</div>
						</div>
						{i.alertCount?<div className="chats-alert">{i.alertCount}</div>:null}
					</NavLink>
				))}
			</div>
			<div className="chat">
				{params.profile?(
					<>
						<div className="chat-header">
							<div className="chat-dp">
								<img src="" />
							</div>
							<div className="chat-title">{crntChat?.name}</div>
						</div>
						<div className="chat-box">
							{crntChat?.messages?.map(msg => msg.type==="msg"?(
								<div className={"msg-outer "+(msg.from===profile._id?"msg-sent":"msg-received")} key={msg._id}>
									<div className="msg-text">{msg.text}</div>
									<div className="msg-info">
										<div className="msg-time">{msg.createdAt}</div>
										{msg.from===profile._id?<div className="msg-status">{msg.seen || msg.seenAt?

											<svg width="1.4em" height="1.2em" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
												<g clip-path="url(#clip0_949_23339)">
													<path d="M17.5821 6.95711C17.9726 6.56658 17.9726 5.93342 17.5821 5.54289C17.1916 5.15237 16.5584 5.15237 16.1679 5.54289L5.54545 16.1653L1.70711 12.327C1.31658 11.9365 0.683417 11.9365 0.292893 12.327C-0.0976311 12.7175 -0.097631 13.3507 0.292893 13.7412L4.83835 18.2866C5.22887 18.6772 5.86204 18.6772 6.25256 18.2866L17.5821 6.95711Z" fill="#34b7f1"/>
													<path d="M23.5821 6.95711C23.9726 6.56658 23.9726 5.93342 23.5821 5.54289C23.1915 5.15237 22.5584 5.15237 22.1678 5.54289L10.8383 16.8724C10.4478 17.263 10.4478 17.8961 10.8383 18.2866C11.2288 18.6772 11.862 18.6772 12.2525 18.2866L23.5821 6.95711Z" fill="#34b7f1"/>
												</g>
												<defs>
													<clipPath id="clip0_949_23339">
														<rect width="24" height="24" fill="white"/>
													</clipPath>
												</defs>
											</svg>
										:
											<svg width="1.4em" height="1.2em" viewBox="0 0 20 20" fill="none">
<path fill-rule="evenodd" clip-rule="evenodd" d="M9.9647 14.9617L17.4693 7.44735L18.5307 8.50732L9.96538 17.0837L5.46967 12.588L6.53033 11.5273L9.9647 14.9617Z" fill="#1F2328"/>
</svg>
}</div>:null}
									</div>
								</div>
							):(
								<div className="chat-date">{msg.date}</div>
							))}
						</div>
						<div className="chat-footer">
							<div className="chat-footer-area">
								<textarea className="chat-input" placeholder="Enter a text to send..." onKeyDown={onKeyDown} onChange={e => setMsgInput(e.target.value)} value={msgInput} />
							</div>
							<button disabled={socketStatus!=='live'} onClick={sendMessage} className="chat-sendbutton">Send</button>
						</div>
					</>
				):(
					<div className="chat-empty">
						<h2>Chat Box</h2>
						Select a chat and start sending messages.
					</div>
				)}
			</div>
		</div>
	)
}

function showTime(d)  {
	return (d.getHours()%12 || 12)+":"+(d.getMinutes()+"").padStart(2, "0")+" "+(d.getHours()>11?"pm":"am")
}
function showDate(d) {
	let now = new Date(), today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
	return d.getTime()>today.getTime()?
		"Today"
		:d.getTime()>today.getTime()-24*3600000?
			"Yesterday"
			:d.getDate()
				+' '
				+
					[
						'January',
						'February',
						'March',
						'April',
						'May',
						'June',
						'July',
						'August',
						'September',
						'October',
						'November',
						'December'
					][d.getMonth()]
				+' '
				+d.getFullYear()
}
