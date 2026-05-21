import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

// =====================
// UPLOAD PAYMENT SLIP
// =====================
router.post('/slip', authenticate, async (req, res) => {
  try {
    const { orderId } = req.body;

    // TODO:
    // - handle multipart/form-data upload
    // - store image URL
    // - create PaymentSlip record (pending)

    return res.status(201).json({
      message: 'upload slip placeholder',
      orderId
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

// =====================
// APPROVE PAYMENT (ADMIN ONLY)
// =====================
router.post('/:id/approve', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { id } = req.params;

    // TODO:
    // - mark slip approved
    // - update order to paid
    // - deduct stock
    // - create stock movement
    // - update financial report

    return res.json({
      message: 'approve payment placeholder',
      id
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

// =====================
// REJECT PAYMENT (ADMIN ONLY)
// =====================
router.post('/:id/reject', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { id } = req.params;

    // TODO: mark slip rejected, order remains pending or flagged

    return res.json({
      message: 'reject payment placeholder',
      id
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
