'use client'

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { ArrowLeft, ArrowRight, Eye, EyeClosed, Loader, Shield } from 'lucide-react';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export function MultiStepLoginForm() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUri = searchParams.get('redirect_uri') || '/';

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setStep(2);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) return;
    
    setIsLoading(true);
    await handleLogin(e);
    setIsLoading(false);
    setStep(3);
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    };
  };

   async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    // setError('')

    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    })

    if (res.ok) {
      router.push(redirectUri)
    } else {
      const data = await res.json()
      // setError(data.error || 'Erro ao fazer login')
    }
  }

  return(
    <Card className='w-md'>
      <CardHeader className='text-center space-y-4'>
        <Image
          src='/assets/images/logo-primary.webp'
          className='mx-auto w-36'
          alt='CrediSIS CrediAri Logo Green'
          height={100}
          width={200}
        />

        <div>
          <CardTitle className='text-2xl font-semibold'>
            {step === 1 && 'Continue com sua conta'}
            {step === 2 && 'Digite sua senha'}
            {step === 3 && 'Verificação em duas etapas'}
          </CardTitle>
          <CardDescription className='text-muted-foreground mb-3'>
            {step === 1 && 'Use sua conta corporativa para continuar'}
            {step === 2 && email}
            {step === 3 && 'Digite o código do seu aplicativo autenticador'}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className='space-y-6'>
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email corporativo</Label>
              <Input
                id='email'
                type='email'
                autoComplete='email'
                placeholder='seu.email@credisis.com.br'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button
              type='submit' 
              className='group w-full'
              disabled={isLoading || !email}
            >
              {isLoading ? (
                <>
                  <Loader className='animate-spin' />
                  Verificando...
                </>
              ) : (
                <>
                  Avançar
                  <ArrowRight className='group-hover:translate-x-1 transition-transform' />
                </>
              )}
            </Button>
          </form>
        )}

        {/* Step 2: Password */}
        {step === 2 && (
          <form onSubmit={handlePasswordSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='password'>Senha</Label>
              <div className='relative'>
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Digite sua senha'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className='pr-9'
                />
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  className='size-7 [&_svg]:size-4 absolute right-1 top-1/2 -translate-y-1/2 rounded-full text-muted-foreground'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeClosed /> : <Eye />}
                </Button>
              </div>
            </div>

            <Button
              type='submit' 
              className='group w-full'
              disabled={isLoading || !email}
            >
              {isLoading ? (
                <>
                  <Loader className='animate-spin' />
                  Autenticando...
                </>
              ) : (
                <>
                  Entrar
                  <ArrowRight className='group-hover:translate-x-1 transition-transform' />
                </>
              )}
            </Button>
          </form>
        )}

        {step > 1 && (
          <Button
            type='button'
            variant='ghost'
            onClick={goBack}
            className='w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800'
            disabled={isLoading}
          >
            <ArrowLeft className='w-4 h-4' />
            Voltar
          </Button>
        )}

        <div className='text-center space-y-2 pt-4 border-t'>
          <p className='text-sm text-gray-600'>
            Problemas para entrar?{' '}
            <button className='text-blue-600 hover:underline'>
              Entre em contato com o suporte
            </button>
          </p>
          {step === 1 && (
            <p className='text-xs text-gray-500'>
              CrediAri Account uma conta, vários apps.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};