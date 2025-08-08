import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const body = await req.json();
  const { email, appName } = body;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { name: true, avatarUrl: true, permissions: true },
  });

  if (!user) {
    return NextResponse.json({ error: 'USER_NOT_FOUND', message: 'User not found' }, { status: 404 });
  };

  const canAccess = user.permissions.some(p => p.appName === appName && p.active);

  if (!canAccess) {
    return NextResponse.json({ error: 'ACCESS_DENIED', message: 'User does not have permission' }, { status: 401 });
  };

  return NextResponse.json({ userName: user.name, userAvatar: user.avatarUrl });
};