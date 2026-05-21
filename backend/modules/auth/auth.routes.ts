import { Router } from 'express';

const router = Router();

// =====================
// LOGIN
// =====================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // TODO: implement service layer authentication
    // - validate user
    // - compare password hash
    // - issue JWT

    return res.status(200).json({
      message: 'login endpoint placeholder',
      email
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
