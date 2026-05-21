import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

// =====================
// GET ALL PRODUCTS
// =====================
router.get('/', authenticate, async (req, res) => {
  try {
    // TODO: fetch active products from DB
    return res.json({ message: 'list products placeholder' });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

// =====================
// CREATE PRODUCT (ADMIN ONLY)
// =====================
router.post('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { name, price, stockQty } = req.body;

    // TODO: create product in DB
    return res.json({
      message: 'create product placeholder',
      data: { name, price, stockQty }
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

// =====================
// UPDATE PRODUCT (ADMIN ONLY)
// =====================
router.patch('/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { id } = req.params;

    // TODO: update product
    return res.json({
      message: 'update product placeholder',
      id
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
