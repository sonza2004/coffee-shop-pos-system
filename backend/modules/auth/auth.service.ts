import jwt from 'jsonwebtoken';
import prisma from '../../config/prisma';
import bcrypt from 'bcryptjs';

// SECURITY FIX: no fallback secret allowed
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('[FATAL] JWT_SECRET is not defined. Server cannot start without secure signing key.');
}

export async function loginService(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw { status: 401, message: 'Invalid credentials' };
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    throw { status: 401, message: 'Invalid credentials' };
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: '1d' }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
}
