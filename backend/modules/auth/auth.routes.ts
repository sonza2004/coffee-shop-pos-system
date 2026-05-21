import express from 'express';
import { loginService } from './auth.service';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password required', code: 'VALIDATION_ERROR' });
    }

    const result = await loginService(email, password);

    return res.json({ data: result });
  } catch (err: any) {
    console.error('[AUTH_LOGIN_ERROR]', err);

    return res.status(err.status || 500).json({
      error: err.message || 'Internal Server Error',
      code: 'AUTH_ERROR'
    });
  }
});

export default router;
