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
    
    socket.on('store-change',change =>{
        console.log('change',change)
        // io.emit('store-change',change)
    })

    socket.on('join-topic', topic => {
        socket.leave(socket.topic)
        socket.join(topic)
        socket.topic = topic
        //console.log('t',socket.topic)
        
        // socket.emit('chat-history', history.filter(msg => msg.topic === socket.topic))
    })

    socket.on('typing',user=> {
        socket.broadcast.emit('typing',user)

    })

    socket.on('chat-msg',  msg =>{
        io.to(socket.topic).emit('chat-msg', msg)
        history.push(msg)
    })


})
}