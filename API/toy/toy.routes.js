import express from 'express'
import { getToys, getToyById, updateToy, addToy, removeToy, addToyMsg, removeToyMsg } from './toy.controller.js'
import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'

const router = express.Router() 

export const toyRouter = router

toyRouter.get('/', getToys )
toyRouter.get('/:id', getToyById)
toyRouter.post('/', requireAuth, requireAdmin, addToy)
toyRouter.put('/:id', requireAuth, requireAdmin, updateToy)
toyRouter.delete('/:id', requireAuth, requireAdmin, removeToy)

toyRouter.post('/:toyId/msg', requireAuth, addToyMsg)
toyRouter.delete('/:toyId/msg/:msgId', requireAuth,  requireAdmin, removeToyMsg)