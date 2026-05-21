import express from 'express';
import { authMiddleware, AuthRequest } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import {
  approvePaymentService,
  rejectPaymentService
} from '../../services/payment.service';
import prisma from '../../config/prisma';

const router = express.Router();

router.post('/slip', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { orderId, imageUrl } = req.body;

    if (!orderId || !imageUrl) {
      return res.status(400).json({ error: 'Missing fields', code: 'VALIDATION_ERROR' });
    }

    // Prevent duplicate slip per order
    const existingSlip = await prisma.paymentSlip.findFirst({
      where: { orderId }
    });

    if (existingSlip) {
      return res.status(400).json({
        error: 'Payment slip already exists for this order',
        code: 'DUPLICATE_SLIP'
      });
    }

    const slip = await prisma.paymentSlip.create({
      data: {
        orderId,
        imageUrl,
        status: 'pending'
      }
    });

    res.json({ data: slip });
  } catch (err: any) {
    console.error('[PAYMENT_SLIP_ERROR]', err);

    res.status(500).json({ error: 'Failed to upload slip', code: 'SLIP_ERROR' });
  }
});

router.post('/:id/approve', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await approvePaymentService(id);
    res.json({ data: result });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to approve payment', code: 'PAYMENT_APPROVE_ERROR' });
  }
});

router.post('/:id/reject', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await rejectPaymentService(id);
    res.json({ data: result });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to reject payment', code: 'PAYMENT_REJECT_ERROR' });
  }
});

export default router;
