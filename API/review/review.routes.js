import express from 'express'
import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'
import { getReviews, deleteReview, addReview } from './review.controller.js'

const router = express.Router()
export const reviewRouter = router

router.get('/', getReviews)
router.delete('/:id', requireAuth, requireAdmin, deleteReview)
router.post('/', requireAuth, addReview)




