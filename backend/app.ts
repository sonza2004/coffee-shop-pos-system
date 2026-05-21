import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Routes
import authRoutes from './modules/auth/auth.routes';
import productRoutes from './modules/products/product.routes';

const app = express();

// =====================
// MIDDLEWARE
// =====================
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// =====================
// HEALTH CHECK
// =====================
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'coffee-shop-pos-api' });
});

// =====================
// MODULE ROUTES
// =====================
app.use('/auth', authRoutes);
app.use('/products', productRoutes);

// =====================
// GLOBAL ERROR HANDLER
// =====================
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[ERROR]', err);

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

export default app;
