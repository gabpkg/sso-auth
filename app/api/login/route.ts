import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

import {
  generateAccessToken,
  generateRefreshToken,
} from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, appName } = body;

  const user = await prisma.user.findUnique({ where: { email }, include: { permissions: true } });
  if (!user) {
    return NextResponse.json({ error: 'USER_NOT_FOUND', message: 'User not found' }, { status: 404 });
  };

  const canAccess = user.permissions.some(p => p.appName === appName && p.active);
  if (!canAccess) {
    return NextResponse.json({ error: 'ACCESS_DENIED', message: 'User does not have permission' }, { status: 401 });
  };

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: 'INVALID_PASSWORD', message: "User's password is invalid" }, { status: 401 });
  };

  const accessToken = generateAccessToken(user.id);
  const refreshToken = await generateRefreshToken(user.id);

  const domain = process.env.NODE_ENV === 'production' ? '.crediari.local' : '.localhost';

  const response = NextResponse.json({ message: 'Login bem-sucedido' });

  response.cookies.set('access_token', accessToken, {
    httpOnly: true,
    secure: true,
    path: '/',
    maxAge: 60 * 15,
    domain,
  });

  response.cookies.set('refresh_token', refreshToken, {
    httpOnly: true,
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    domain,
  });

  return response;
};