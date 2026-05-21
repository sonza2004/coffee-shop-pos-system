import express from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import {
  approvePaymentService,
  rejectPaymentService
} from '../../services/payment.service';

const router = express.Router();

// =====================
// POST /payments/:id/approve
// =====================
router.post('/:id/approve', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await approvePaymentService(id);

    res.json({ data: result });
  } catch (err: any) {
    console.error('[PAYMENT_APPROVE_ERROR]', err);

    res.status(500).json({
      error: 'Failed to approve payment',
      code: 'PAYMENT_APPROVE_ERROR'
    });
  }
});

// =====================
// POST /payments/:id/reject
// =====================
router.post('/:id/reject', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await rejectPaymentService(id);

    res.json({ data: result });
  } catch (err: any) {
    console.error('[PAYMENT_REJECT_ERROR]', err);

    res.status(500).json({
      error: 'Failed to reject payment',
      code: 'PAYMENT_REJECT_ERROR'
    });
  }
});

export default router;
