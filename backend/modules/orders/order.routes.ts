import express from 'express';
import { authMiddleware, AuthRequest } from '../../middlewares/auth.middleware';
import { createOrderService, getOrderByIdService } from './order.service';

const router = express.Router();

// =====================
// POST /orders
// =====================
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Invalid items', code: 'VALIDATION_ERROR' });
    }

    const userId = req.user.userId;

    const order = await createOrderService(userId, items);

    return res.json({ data: order });
  } catch (err: any) {
    console.error('[ORDER_CREATE_ERROR]', err);

    return res.status(500).json({ error: 'Failed to create order', code: 'ORDER_ERROR' });
  }
});

// =====================
// GET /orders/:id
// =====================
router.get('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const order = await getOrderByIdService(id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found', code: 'NOT_FOUND' });
    }

    return res.json({ data: order });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch order', code: 'ORDER_ERROR' });
  }
});

export default router;
