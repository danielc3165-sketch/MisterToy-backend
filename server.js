import path from 'path'
import express from 'express'
import cors from 'cors'


import { toyService } from './services/toy.service.js'
import { loggerService } from './services/logger.service.js'
import console from 'console'

const app = express()
const corsOptions = {
    origin: [
      'http://127.0.0.1:5173',
      'http://localhost:5173',
      
      'http://127.0.0.1:5174',
      'http://localhost:5174',
    ],
    credentials: true,
}

// Express Config:
app.use(cors(corsOptions))
app.use(express.static('public'))
app.use(express.json())

// Express Routing:

// REST API for Toys
app.get('/api/toy', (req, res) => {

  const { txt, inStock, labels, sortBy } = req.query

  const filterBy = {
    txt: txt || '',
    inStock: inStock === 'true' ? true : false ,
    labels: labels || [],
    sortBy: sortBy || 'createAt',
  }

  
    toyService.query(filterBy)
        .then(toys => {
            console.log('S toys',toys)
            res.send(toys)
        })
        .catch(err => {
            loggerService.error('Cannot get toys', err)
            res.status(400).send('Cannot get toys')
        })
})

app.get('/api/toy/:toyId', (req, res) => {
    const { toyId } = req.params

    toyService.getById(toyId)
        .then(toy => res.send(toy))
        .catch(err => {
            loggerService.error('Cannot get toy', err)
            res.status(400).send('Cannot get toy')
        })
})

app.post('/api/toy', (req, res) => {
    
    const toy = {
        name: req.body.name,
        price: +req.body.price,
        imgUrl: req.body.imgUrl,
        labels: req.body.labels,
        inStock: req.body.inStock = 'true' ? true : false
    }


    toyService.save(toy)
        .then(savedToy => res.send(savedToy))
        .catch(err => {
            loggerService.error('Cannot save toy', err)
            res.status(400).send('Cannot save toy')
        })
})

app.put('/api/toy/:id', (req, res) => {
   
    const toy = {
        _id: req.params.id,
        name: req.body.name,
        price: +req.body.price,
        imgUrl: req.body.imgUrl,
        labels: req.body.labels,
        inStock: req.body.inStock = 'true' ? true : false,
        createdAt:+req.body.createdAt
        
    }

    
    toyService.save(toy)
        .then(savedToy => {
            //console.log('UP toy',savedToy)
            res.send(savedToy)
        })
        .catch(err => {
            loggerService.error('Cannot save toy', err)
            res.status(400).send('Cannot save toy')
        })
})

app.delete('/api/toy/:toyId', (req, res) => {

    const { toyId } = req.params

    toyService.remove(toyId)
        .then(() => res.send('Removed!'))
        .catch(err => {
            loggerService.error('Cannot remove toy', err)
            res.status(400).send('Cannot remove toy')
        })
})

// // User API
// app.get('/api/user', (req, res) => {
//     userService.query()
//         .then(users => res.send(users))
//         .catch(err => {
//             loggerService.error('Cannot load users', err)
//             res.status(400).send('Cannot load users')
//         })
// })



// app.get('/api/user/:userId', (req, res) => {
//     const { userId } = req.params

//     userService.getById(userId)
//         .then(user => res.send(user))
//         .catch(err => {
//             loggerService.error('Cannot load user', err)
//             res.status(400).send('Cannot load user')
//         })
// })

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
