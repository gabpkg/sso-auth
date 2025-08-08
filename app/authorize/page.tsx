import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

type Props = {
  searchParams: {
    redirect_uri?: string;
  };
};

export default async function AuthorizePage({ searchParams }: Props) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  const redirectUri = searchParams.redirect_uri ?? '/';

  if (!accessToken) {
    redirect(`/login?redirect_uri=${encodeURIComponent(redirectUri)}`);
  };

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!);
    redirect(redirectUri);
  } catch (err) {
    redirect(`/login?redirect_uri=${encodeURIComponent(redirectUri)}`);
  };
};