
import { useState } from 'react'
import Chat from './components/Chat'
import { Container, CardContent, Card, FormField, Button, Form, Icon } from 'semantic-ui-react'
import './App.css'

import io from 'socket.io-client'

/* const socket = io.connect("http://localhost:3001") */
const socket = io.connect("https://backend-chat-en-tiempo-real-dev-haxk.4.us-1.fl0.io")

function App() {
  const [username, setUsername] = useState("")
  const [room, setRoom] = useState("")
  const [userId, setUserId] = useState("")
  const [showChat, setShowChat] = useState(false)

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join__room", room);
      setShowChat(true);
    }
  }
  return (
    <>
      <Container>
        {!showChat ?
          <Card fluid>
            <CardContent header='Unirme al chat' />
            <CardContent>
              <Form>
                <FormField>
                  <label>Nombre de usuario</label>
                  <input type="text" placeholder='Nombre de Usuario...' onChange={e => setUsername(e.target.value)} />
                </FormField>
                <FormField>
                  <label>ID de la sala</label>
                  <input type="text" placeholder='ID Sala:' onChange={e => setRoom(e.target.value)} />
                </FormField>
                <FormField>
                  <label>ID de usuario</label>
                  <input type="text" placeholder='ID de usuario:' onChange={e => setUserId(e.target.value)} />
                </FormField>

                <Button onClick={joinRoom}>Entrar a la sala</Button>
              </Form>
            </CardContent>
            <CardContent extra>
              <Icon name='user' />4 Friends
            </CardContent>
          </Card>
          :
          <Chat socket={socket} username={username} room={room} userId={userId} />}
      </Container>
    </>
  )
}



export default App
