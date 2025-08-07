import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import {
  generateAccessToken,
  generateRefreshToken,
} from '@/lib/auth';

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
  };

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: 'Senha inválida' }, { status: 401 });
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