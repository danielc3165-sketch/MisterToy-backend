import express from 'express'
import cors from 'cors'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import cookieParser from 'cookie-parser'

import { setupAsyncLocalStorage } from './middlewares/setupAls.middleware.js'


import console from 'console'

import { toyRouter } from './API/toy/toy.routes.js'
import { userRouter } from './API/user/user.routes.js'
import { authRouter } from './API/auth/auth.routes.js'
import { reviewRouter } from './API/review/review.routes.js'

import { setupSocketAPI } from './services/socket.service.js'
import { createServer } from 'node:http'


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

import { loggerService } from './services/logger.service.js'
loggerService.info('server.js loaded...')



const app = express()
const server = createServer(app)



// Express Config:


app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())
app.all('*all', setupAsyncLocalStorage)



// if (process.env.NODE_ENV === 'production') {
//     // Express serve static files on production environment
//     app.use(express.static(path.resolve(__dirname, 'public')))
//     console.log('__dirname: ', __dirname)
// }else{}

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


// Express Routing:

app.use('/api/toy',toyRouter)
app.use('/api/user',userRouter)
app.use('/api/auth',authRouter)
app.use('/api/review', reviewRouter)

setupSocketAPI(server)


const PORT = process.env.PORT || 3030
server.listen(PORT, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${PORT}/`)
)
d