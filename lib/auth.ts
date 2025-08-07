import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET!;

export function generateAccessToken(userId: number) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '15m' });
};

export function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  };
};

export async function generateRefreshToken(userId: number) {
  const token = randomBytes(64).toString('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

  await prisma.refreshToken.create({
    data: { token, userId, expiresAt },
  });

  return token;
};

export async function revokeRefreshToken(token: string) {
  await prisma.refreshToken.updateMany({
    where: { token },
    data: { revoked: true },
  });
};