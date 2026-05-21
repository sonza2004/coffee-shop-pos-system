import express from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { getDailyReportService } from '../../services/report.service';

const router = express.Router();

// =====================
// GET /reports/daily
// =====================
router.get('/daily', authMiddleware, async (req, res) => {
  try {
    const report = await getDailyReportService();

    res.json({ data: report });
  } catch (err: any) {
    console.error('[REPORT_DAILY_ERROR]', err);

    res.status(500).json({
      error: 'Failed to fetch report',
      code: 'REPORT_ERROR'
    });
  }
});

export default router;
