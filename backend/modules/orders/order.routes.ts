import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

// =====================
// CREATE ORDER
// =====================
router.post('/', authenticate, async (req, res) => {
  try {
    const { items } = req.body;

    // items: [{ productId, qty }]
    // TODO:
    // 1. validate products
    // 2. calculate total
    // 3. create order + order items

    return res.status(201).json({
      message: 'create order placeholder',
      items
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

// =====================
// GET ORDER BY ID
// =====================
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    // TODO: fetch order with items
    return res.json({
      message: 'get order placeholder',
      id
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
