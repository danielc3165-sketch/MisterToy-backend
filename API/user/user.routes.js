import express from 'express'
import { getUsers, getUser, deleteUser,  updateUser} from './user.controller.js'


const router = express.Router() 

export const userRouter = router

userRouter.get('/', getUsers )
userRouter.get('/:id', getUser)
// userRouter.post('/', addToy)
userRouter.put('/:id',  updateUser)
userRouter.delete('/:id', deleteUser)