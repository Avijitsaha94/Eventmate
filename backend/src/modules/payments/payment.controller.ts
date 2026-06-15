import { Request, Response } from 'express'
import { AuthRequest } from '../../middleware/auth.middleware'
import { getHostRevenueChartService } from './payment.service'
import {
  createPaymentService,
  paymentSuccessService,
  paymentFailService,
  paymentCancelService,
  getHostRevenueService,
  getMyPaymentsService,
} from './payment.service'

// Payment শুরু করো
export const createPayment = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { eventId } = req.body
    if (!eventId) {
      res.status(400).json({ success: false, message: 'Event ID is required' })
      return
    }
    const result = await createPaymentService(req.user!._id, eventId)
    res.status(200).json({ success: true, data: result })
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// SSLCommerz Success Callback
// ⚠️ এটা POST request, SSLCommerz সরাসরি call করবে
export const paymentSuccess = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await paymentSuccessService(req.body)
    if (result.success) {
      res.redirect(
        `${process.env.FRONTEND_URL}/payment/success?eventId=${result.eventId}`
      )
    } else {
      res.redirect(`${process.env.FRONTEND_URL}/payment/fail`)
    }
  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/payment/fail`)
  }
}

// SSLCommerz Fail Callback
export const paymentFail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await paymentFailService(req.body)
    res.redirect(`${process.env.FRONTEND_URL}/payment/fail`)
  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/payment/fail`)
  }
}

// SSLCommerz Cancel Callback
export const paymentCancel = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await paymentCancelService(req.body)
    res.redirect(`${process.env.FRONTEND_URL}/payment/cancel`)
  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/payment/cancel`)
  }
}

// Host revenue
export const getHostRevenue = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const result = await getHostRevenueService(req.user!._id)
    res.status(200).json({ success: true, data: result })
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
  }
}




export const getHostRevenueChart = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const data = await getHostRevenueChartService(req.user!._id)
    res.status(200).json({ success: true, data })
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
  }
}
// My payments
export const getMyPayments = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const payments = await getMyPaymentsService(req.user!._id)
    res.status(200).json({ success: true, data: payments })
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message })
  }
}