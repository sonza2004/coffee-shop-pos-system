import express from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import {
  getProductsService,
  createProductService,
  updateProductService
} from './product.service';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const products = await getProductsService();
    res.json({ data: products });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.post('/', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const { name, price, stockQty } = req.body;

    if (!name || price == null || stockQty == null) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const product = await createProductService({ name, price, stockQty });

    res.json({ data: product });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

router.patch('/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await updateProductService(id, req.body);

    res.json({ data: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

export default router;
