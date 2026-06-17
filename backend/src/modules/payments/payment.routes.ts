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
import { getHostRevenueChart } from './payment.controller'
import { RequestHandler } from 'express'

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
  createPayment as RequestHandler
)
router.get('/my', protect, getMyPayments as RequestHandler)
router.get(
  '/host/revenue',
  protect,
  allowTo('host', 'admin'),
  getHostRevenue as RequestHandler
)
router.get('/host/revenue-chart', protect, allowTo('host', 'admin'), getHostRevenueChart as RequestHandler)

export default router