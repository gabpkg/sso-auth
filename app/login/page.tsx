'use client'

import dynamic from 'next/dynamic';

import { MultiStepLoginForm } from '@/components/login/multi-step-login-form';

const RandomQuotes = dynamic(() => import('@/components/login/random-quotes'), {
  ssr: false
});

export default function Login() {
  return (
    <div className='min-h-screen relative flex items-center justify-around p-4 bg-[url(/assets/images/background.webp)]'>
      <MultiStepLoginForm />

      <RandomQuotes />

      <div className='absolute bottom-4 left-4 text-white/80 text-sm'>
        <p>© {new Date().getFullYear()} CrediSIS CrediAri Tecnologia. Todos os direitos reservados.</p>
      </div>
    </div>
  );
};