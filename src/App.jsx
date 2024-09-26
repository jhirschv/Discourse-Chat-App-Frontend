import { useState, useContext, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { ThemeProvider } from "@/components/theme-provider"
import RootLayout from './_root/RootLayout'
import { Routes, Route } from 'react-router-dom';
import Chat from './_root/pages/Chat';
import Home from './_root/pages/Home';
import SigninForm from './_auth/SigninForm';
import SignupForm from './_auth/SignupForm';
import Account from './_root/pages/Account';
import PrivateRoute from './utils/PrivateRoute'
import apiClient from './services/apiClient';
import AuthContext from './context/AuthContext';
import useDisableZoom from './utils/useDisableZoom';

function App() {
  useDisableZoom();
  const { user } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    if(user){
    apiClient.get(`/users/${user.user_id}/`)
        .then(response => {
            setUserInfo(response.data)
            console.log(response.data)
        })
        .catch(error => console.error('Error:', error));
      }
    }, [user]);

  const [chatSessions, setChatSessions] = useState([]);

  const fetchUserChatSessions = async () => {
    if(user){
      try {
        const response = await apiClient.get('/user_chats/');
        const sessions = response.data;
        setChatSessions(sessions);
        console.log(response.data)
    } catch (error) {
        console.error('Error fetching chat sessions:', error);
    }
  }
};

const [webSocket, setWebSocket] = useState(null);
const [messages, setMessages] = useState([]);
const [selectedChat, setSelectedChat] = useState()

useEffect(() => {
  fetchUserChatSessions();
  setSelectedChat();
}, [user]);


useEffect(() => {
  if (!user) return;

  const wsScheme = window.location.protocol === "https:" ? "wss" : "ws";
  const wsURL = `${wsScheme}://discourse-chat-07776d7da87a.herokuapp.com/ws/user/${user.user_id}/`;

  const ws = new WebSocket(wsURL);

  ws.onopen = () => console.log("WebSocket connection established.");
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

      let otherUserId;
      
      if (data.message.sender === user.user_id) {
        // If the current user is the sender, then the other user is the recipient
        otherUserId = data.message.recipient;
      } else {
        // Otherwise, the other user must be the sender
        otherUserId = data.message.sender;
      }

      // Update messages by appending to the correct user's message array
      setMessages(prevMessages => ({
        ...prevMessages,
        [otherUserId]: [
          ...(prevMessages[otherUserId] || []), // Use existing messages or start a new array if none exist
          data.message
        ]
      }));
      
      // Optionally fetch user chat sessions after receiving a message
      fetchUserChatSessions();
  };
  
  setWebSocket(ws);  // Store WebSocket in state
  
  // Cleanup function to close WebSocket when component unmounts or user logs out
  return () => {
    ws.close();
  };

}, [user]);

const sendMessage = (input) => {
  if (input) {
    const messageObject = {
      type: 'message',
      senderId: user.user_id,
      recipientId: selectedChat.id,  // Make sure selectedChat is managed appropriately
      content: input.trim()
    };
    webSocket.send(JSON.stringify(messageObject));
  }
};

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route element={<RootLayout userInfo={userInfo} setUserInfo={setUserInfo}/>} >
            <Route index element={<Chat 
            sendMessage={sendMessage} messages={messages} setMessages={setMessages} 
            chatSessions={chatSessions} setChatSessions={setChatSessions} 
            fetchUserChatSessions={fetchUserChatSessions} selectedChat={selectedChat} 
            setSelectedChat={setSelectedChat} webSocket={webSocket}
            />} />
            <Route path='/account' element={<Account userInfo={userInfo} setUserInfo={setUserInfo}/>}/>
          </Route>
        </Route>
        <Route path='/home' element={<Home />}/>
        <Route path='/signin' element={<SigninForm />}/>
        <Route path='/signup' element={<SignupForm />}/>
      </Routes>
    </ThemeProvider>
  )
}

export default App
