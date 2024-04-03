import { useEffect, useState } from 'react'
import { CardContent, Card, Icon, Container, FormField, Form, Input, Message, MessageHeader, Divider } from 'semantic-ui-react'


const Chat = ({ socket, username, room, userId }) => {

    const [currentMessage, setCurrentMessage] = useState("")
    const [messagesList, setMessagesList] = useState([])

    // Definición de la función asincrónica sendMessage
    const sendMessage = async () => {
        // Verificar si existen las variables necesarias para enviar el mensaje
        if (username && userId && currentMessage && room) {
            // Si todas las variables están presentes, crear un objeto 'info' con la información del mensaje
            const info = {
                message: currentMessage, // Mensaje actual
                room: room, // Sala o dirección del mensaje
                author: username, // Nombre del usuario que envía el mensaje
                userId: userId, // ID del usuario que envía el mensaje
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes() // Hora actual en formato HH:MM
            };

            // Enviar el mensaje a través del socket utilizando el evento "send_message"
            await socket.emit("send_message", info);

            // Actualizar la lista de mensajes añadiendo el mensaje enviado
            setMessagesList((list) => [...list, info])
        }
    }

    // useEffect se utiliza para realizar efectos secundarios en componentes funcionales de React
    useEffect(() => {
        // Se define una función llamada messageHandle que se encarga de manejar los mensajes recibidos
        const messageHandle = (data) => {
            // Se actualiza la lista de mensajes añadiendo el mensaje recibido
            setMessagesList((list) => [...list, data])
        }
        // Se suscribe a eventos de "recieve_message" en el socket, y se ejecuta messageHandle cuando se recibe un mensaje
        socket.on("recieve_message", messageHandle)

        // Se limpia el efecto cuando el componente se desmonta o cuando el socket cambia
        return () => socket.off("recieve_message", messageHandle)

        // El efecto se dispara cuando el socket cambia
    }, [socket])

    
    return (
        <Container>
            <Card fluid>
                <CardContent header={`Chat en vivo | Sala: ${room}`} />
                <CardContent style={{ minHeight: "300px" }}>
                    {messagesList.map((item, i) => {
                        return (
                            <span key={i}>
                                <Message
                                    style={{ textAlign: username === item.author ? 'right' : 'left' }}
                                    success={username === item.author}
                                    info={username !== item.author}>
                                    <MessageHeader>{item.message}</MessageHeader>
                                    <p>Enviado por: <strong>{item.author}</strong>, a las <i>{item.time}</i></p>

                                </Message>
                                <Divider></Divider>
                            </span>
                        )
                    })

                    }
                </CardContent>
                <CardContent extra>
                    <Form>
                        <FormField>
                            <Input action={{
                                color: 'teal',
                                labelPosition: 'right',
                                icon: 'send',
                                content: 'Send',
                                onClick: sendMessage
                            }}
                                type="text" placeholder='Mensaje...'
                                onChange={e => setCurrentMessage(e.target.value)} />
                        </FormField>
                        <Icon name='user' />4 Friends
                    </Form>

                </CardContent>
            </Card>
        </Container>
    )
}

export default Chat