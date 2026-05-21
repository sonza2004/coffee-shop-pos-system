import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { ReportService } from '../../services/report.service';

const router = Router();

// =====================
// DAILY REPORT
// =====================
router.get('/daily', authenticate, authorize(['admin', 'owner']), async (req, res) => {
  try {
    const date = req.query.date ? new Date(req.query.date as string) : new Date();

    const report = await ReportService.getDailyReport(date);

    return res.json(report);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
