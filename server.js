import express from 'express'
import cors from 'cors'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import cookieParser from 'cookie-parser'

import console from 'console'

import { toyRouter } from './API/toy/toy.routes.js'
import { userRouter } from './API/user/user.routes.js'
import { authRouter } from './API/auth/auth.routes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

import { loggerService } from './services/logger.service.js'
loggerService.info('server.js loaded...')



const app = express()

// Express Config:


app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())

if (process.env.NODE_ENV === 'production') {
    // Express serve static files on production environment
    app.use(express.static(path.resolve(__dirname, 'public')))
    console.log('__dirname: ', __dirname)
}else{

const corsOptions = {
    origin: [
      'http://127.0.0.1:5173',
      'http://localhost:5173',
      
      'http://127.0.0.1:3030', 
      'http://localhost:3030',
    ],
    credentials: true,
}

app.use(cors(corsOptions))

}
// Express Routing:

app.use('/api/toy',toyRouter)
app.use('/api/user',userRouter)
app.use('/api/auth',authRouter)

// // Auth API
// app.post('/api/auth/login', (req, res) => {
//     const credentials = req.body

//     userService.checkLogin(credentials)
//         .then(user => {
//             if (user) {
//                 const loginToken = userService.getLoginToken(user)
//                 res.cookie('loginToken', loginToken)
//                 res.send(user)
//             } else {
//                 res.status(401).send('Invalid Credentials')
//             }
//         })
// })

// app.post('/api/auth/signup', (req, res) => {
//     const credentials = req.body

//     userService.save(credentials)
//         .then(user => {
//             if (user) {
//                 const loginToken = userService.getLoginToken(user)
//                 res.cookie('loginToken', loginToken)
//                 res.send(user)
//             } else {
//                 res.status(400).send('Cannot signup')
//             }
//         })
// })

// app.post('/api/auth/logout', (req, res) => {
//     res.clearCookie('loginToken')
//     res.send('logged-out!')
// })


// app.put('/api/user', (req, res) => {
//     const loggedinUser = userService.validateToken(req.cookies.loginToken)
//     if (!loggedinUser) return res.status(400).send('No logged in user')
//     const { diff } = req.body
//     if (loggedinUser.score + diff < 0) return res.status(400).send('No credit')
//     loggedinUser.score += diff
//     return userService.save(loggedinUser).then(user => {
//         const token = userService.getLoginToken(user)
//         res.cookie('loginToken', token)
//         res.send(user)
//     })
// })



// Fallback route
// app.get('/**', (req, res) => {
//     res.sendFile(path.resolve('public/index.html'))
// })

const PORT = process.env.PORT || 3030
app.listen(PORT, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${PORT}/`)
)
