import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import prisma from '../../config/prisma';

const router = Router();

// =====================
// DAILY REPORT
// =====================
router.get('/daily', authenticate, authorize(['admin', 'owner']), async (req, res) => {
  try {
    const date = req.query.date ? new Date(req.query.date as string) : new Date();

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const orders = await prisma.order.findMany({
      where: {
        status: 'paid',
        createdAt: {
          gte: start,
          lte: end
        }
      },
      include: {
        items: true
      }
    });

    const totalOrders = orders.length;

    const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    const netRevenue = totalSales; // no tax/fee model yet

    return res.json({
      date: start.toISOString().split('T')[0],
      totalOrders,
      totalSales,
      netRevenue
    });

  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
