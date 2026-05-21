import app from './app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PORT = process.env.PORT || 3000;

// =====================
// START SERVER
// =====================
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// =====================
// GRACEFUL SHUTDOWN
// =====================
const shutdown = async () => {
  console.log('Shutting down server...');

  server.close(async () => {
    await prisma.$disconnect();
    console.log('Server closed & DB disconnected');
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
