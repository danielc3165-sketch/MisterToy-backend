import express from 'express'
import { getToys } from './toy.controller.js'


const router = express.Router() 

export const toyRouter = router

toyRouter.get('/',getToys )