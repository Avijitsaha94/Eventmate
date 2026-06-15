import { Router } from 'express'
import {
  createPayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  getHostRevenue,
  getMyPayments,
} from './payment.controller'
import { protect } from '../../middleware/auth.middleware'
import { allowTo } from '../../middleware/role.middleware'

const router = Router()

// SSLCommerz callback routes — protect করা যাবে না
// কারণ SSLCommerz নিজে এই routes এ POST করবে
router.post('/success', paymentSuccess)
router.post('/fail', paymentFail)
router.post('/cancel', paymentCancel)

// Protected routes
router.post(
  '/create-intent',
  protect,
  allowTo('user'),
  createPayment
)
router.get('/my', protect, getMyPayments)
router.get(
  '/host/revenue',
  protect,
  allowTo('host', 'admin'),
  getHostRevenue
)

export default router