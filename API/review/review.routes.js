import express from 'express'
import { getReviews, deleteReview, addReview } from './review.controller.js'

const router = express.Router()
export const reviewRouter = router

router.get('/', getReviews)
router.delete('/:id', deleteReview)
router.post('/', addReview)




