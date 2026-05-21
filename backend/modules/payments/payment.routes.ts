import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { PaymentService } from '../../services/payment.service';

const router = Router();

// =====================
// UPLOAD PAYMENT SLIP
// =====================
router.post('/slip', authenticate, async (req, res) => {
  try {
    const { orderId, imageUrl } = req.body;

    const slip = await PaymentService.uploadSlip(orderId, imageUrl);

    return res.status(201).json({
      message: 'slip uploaded',
      data: slip
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

// =====================
// APPROVE PAYMENT
// =====================
router.post('/:id/approve', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await PaymentService.approvePayment(id);

    return res.json({
      message: 'payment approved',
      data: result
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

// =====================
// REJECT PAYMENT
// =====================
router.post('/:id/reject', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await PaymentService.rejectPayment(id);

    return res.json({
      message: 'payment rejected',
      data: result
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
