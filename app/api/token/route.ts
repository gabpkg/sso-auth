import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { generateAccessToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get('refresh_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Refresh token ausente' }, { status: 401 });
  };

  const saved = await prisma.refreshToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!saved || saved.revoked || saved.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Refresh token inválido' }, { status: 401 });
  };

  const accessToken = generateAccessToken(saved.userId);

  const domain = process.env.NODE_ENV === 'production' ? '.crediari.local' : '.localhost';

  const response = NextResponse.json({ message: 'Token renovado' });
  response.cookies.set('access_token', accessToken, {
    httpOnly: true,
    secure: true,
    path: '/',
    maxAge: 60 * 15,
    domain,
  });

  return response;
};