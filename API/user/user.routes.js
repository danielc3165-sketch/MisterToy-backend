import express from 'express'
import { getUsers} from './user.controller.js'


const router = express.Router() 

export const userRouter = router

userRouter.get('/', getUsers )
// toyRouter.get('/:id', getToyById)
// toyRouter.post('/', addToy)
// toyRouter.put('/:id', updateToy)
// toyRouter.delete('/:id', removeToy)