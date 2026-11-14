import { Server } from 'socket.io'


export function setupSocketAPI(server){
const io = new Server(server, {
        cors: {
            origin: '*',
            credentials: true,
        },
    })

const history = []

io.on('connection', socket => {
    console.log('Someone connected...')

    socket.on('chat-msg',  msg => console.log('msg',msg))
})
}