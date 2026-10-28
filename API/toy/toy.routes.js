import express from 'express'
import { getToys, getToyById, updateToy, addToy, removeToy } from './toy.controller.js'


const router = express.Router() 

export const toyRouter = router

toyRouter.get('/', getToys )
toyRouter.get('/:id', getToyById)
toyRouter.post('/', addToy)
toyRouter.put('/:id', updateToy)
toyRouter.delete('/:id', removeToy)