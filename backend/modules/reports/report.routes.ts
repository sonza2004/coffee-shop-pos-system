import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

// =====================
// DAILY REPORT
// =====================
router.get('/daily', authenticate, authorize(['admin', 'owner']), async (req, res) => {
  try {
    const { date } = req.query;

    // TODO:
    // - aggregate orders by date
    // - sum total sales (only paid orders)
    // - count total orders
    // - compute net revenue

    return res.json({
      message: 'daily report placeholder',
      date
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
