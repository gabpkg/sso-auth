'use client'

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Building, Building2, Eye, EyeClosed, Loader } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import { useRouter,useSearchParams } from 'next/navigation';
import { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { EmailFormData, emailSchema, PasswordFormData, passwordSchema } from '@/types/forms/types-login-form';
import { TypesLoginErrors } from '@/types/types-login-errors';
import { truncateName } from '@/utils/truncate-name';

import { UserAvatar } from '../global/user-avatar';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { AlertLoginError } from './alert-login-error';
import { AnimatedCheck } from './animated-check';

export function MultiStepLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUri = searchParams.get('redirect_uri') || '/';

  const [error, setError] = useState<TypesLoginErrors | null>(null);

  const [step, setStep] = useState(1);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [direction, setDirection] = useState(1);

  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const appName = new URL(redirectUri).hostname.split('.')[0];

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '' },
  });

  const email = emailForm.watch('email');

  const goBack = () => {
    setDirection(-1)
    setStep(step - 1)
  };

  const handleEmailSubmit = async (data: EmailFormData) => {
    try {
      setIsLoading(true);

      const res = await fetch('/api/check-email', {
        method: 'POST',
        body: JSON.stringify({ email: data.email, appName }),
        headers: { 'Content-Type': 'application/json' },
      });
      const responseData = await res.json();

      if(!res.ok) {
        if(responseData.error === 'USER_NOT_FOUND') {
          setError('USER_NOT_FOUND');
        } else if(responseData.error === 'ACCESS_DENIED') {
          setError('ACCESS_DENIED');
        } else {
          toast.error('Erro ao fazer login :(', {
            description: 'Ocorreu um erro ao efetuar seu login, por favor, contate o suporte.'
          });
        };
        return;
      };

      setUserAvatar(responseData.userAvatar);
      setUserName(responseData.userName);
      setDirection(1);
      setStep(step + 1);
    } catch (err) {
      alert('Erro de conexão com o servidor');
      console.error(err);
    } finally {
      setIsLoading(false);
    };
  };

  const handlePasswordSubmit = async (data: PasswordFormData) => {
    try {
      setIsLoading(true);

      const res = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ email, password: data.password,appName }),
        headers: { 'Content-Type': 'application/json' },
      });
      const responseData = await res.json();

      if(!res.ok) {
        if(responseData.error === 'USER_NOT_FOUND') {
          setError('USER_NOT_FOUND');
        } else if(responseData.error === 'ACCESS_DENIED') {
          setError('ACCESS_DENIED');
        } else if(responseData.error === 'INVALID_PASSWORD') {
          toast.error('Senha incorreta', {
            description: 'A senha que você informou está incorreta.'
          });
        } else {
          toast.error('Erro ao fazer login :(', {
            description: 'Ocorreu um erro ao efetuar seu login, por favor, contate o suporte.'
          });
        };
        return;
      };

      setDirection(1);
      setStep(step + 1);
    } catch (err) {
      alert('Erro de conexão com o servidor');
      console.error(err);
    } finally {
      setIsLoading(false);
    };
  };

  const formVariants = {
    initial: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? 50 : -50,
    }),
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.2 },
    },
    exit: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? -50 : 50,
      transition: { duration: 0.2 },
    }),
  };

  return(
    <Card className='w-md overflow-hidden bg-background'>
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
            {step === 2 && `Olá ${truncateName(userName)}!`}
            {step === 3 && 'Verificação em duas etapas'}
          </CardTitle>
          
          {step === 2 && (
            <div>
              <UserAvatar
                userimage={userAvatar}
                username={userName}
                className='mt-2 mx-auto rounded-full size-12'
              />
            </div>
          )}

          <CardDescription className='text-muted-foreground mb-3'>
            {step === 1 && 'Use sua conta corporativa para continuar'}
            {step === 2 && email}
            {step === 3 && 'Digite o código do seu aplicativo autenticador'}
          </CardDescription>
        </div>
      </CardHeader>

      <div className='px-6 pb-4'>
        <div className='flex items-center justify-between gap-4'>
          {[1, 2, 3].map((stepNumber) => (
            <Fragment key={stepNumber}>
              <div className='flex flex-col items-center text-xs gap-1'>
                <div
                  className={cn(
                    'size-10 rounded-full flex items-center justify-center text-sm font-medium',
                    stepNumber < step
                      ? 'bg-primary text-primary-foreground'
                      : stepNumber === step
                      ? 'border-2 border-primary text-primary'
                      : 'bg-accent text-muted-foreground'
                  )}
                >
                  {stepNumber < step ? <AnimatedCheck /> : stepNumber}
                </div>
                {stepNumber === 1 ? 'Email' : stepNumber === 2 ? 'Senha' : 'Redirec.'}
              </div>

              {stepNumber < 3 && (
                <div className='w-full -translate-y-2 h-1 bg-accent'>
                  <div
                    className={cn(
                      'h-full w-0 bg-primary transition-[width]',
                      (step >= stepNumber + 1) && 'w-full' 
                    )}
                  />
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </div>

      <CardContent className='space-y-6'>
        <AnimatePresence mode='wait' custom={direction}>
          {step === 1 && (
            <motion.form
              key='step1'
              onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
              className='space-y-4'
              variants={formVariants}
              initial='initial'
              animate='animate'
              exit='exit'
              custom={direction}
            >
              <div>
                <Label htmlFor='email'>Email corporativo</Label>
                <Input
                  id='email'
                  type='email'
                  className='mt-2'
                  autoComplete='email'
                  placeholder='seu.email@credisis.com.br'
                  aria-invalid={!!emailForm.formState.errors.email}
                  {...emailForm.register('email')}
                />
                <span className='text-sm text-destructive'>{emailForm.formState.errors.email?.message}</span>
              </div>

              <Button
                type='submit' 
                className='group w-full'
                disabled={isLoading}
              >
                {isLoading 
                  ? <><Loader className='animate-spin' /> Verificando...</>
                  : <>Avançar <ArrowRight className='group-hover:translate-x-1 transition-transform' /></>
                }
              </Button>
            </motion.form>
          )}

          {step === 2 && (
            <motion.form
              key='step2'
              onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
              className='space-y-4'
              variants={formVariants}
              initial='initial'
              animate='animate'
              exit='exit'
              custom={direction}
            >
              <div className='space-y-2'>
                <Label htmlFor='password'>Senha</Label>
                <div className='relative'>
                  <Input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Digite sua senha'
                    className='pr-9'
                    aria-invalid={!!passwordForm.formState.errors.password}
                    {...passwordForm.register('password')}
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
                <span className='text-sm text-destructive'>{passwordForm.formState.errors.password?.message}</span>
              </div>

              <Button
                type='submit' 
                className='group w-full'
                disabled={isLoading || !email}
              >
                {isLoading 
                  ? <><Loader className='animate-spin' /> Autenticando...</>
                  : <>Entrar <ArrowRight className='group-hover:translate-x-1 transition-transform' /></>
                }
              </Button>
            </motion.form>
          )}

          {step === 3 && (
            <motion.div
              key='step3'
              className='flex flex-col justify-center items-center'
              initial='initial'
              animate='animate'
              exit='exit'
              custom={direction}
            >
              <div className='mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4'>
                <Building2 className='w-8 h-8 text-white animate-pulse' />
              </div>

              <div className='space-y-3'>
                <h3 className='text-lg font-medium text-gray-900'>
                  Autenticação realizada com sucesso!
                </h3>
                <p className='text-gray-600'>
                  Você será redirecionado para o aplicativo em alguns segundos...
                </p>
              </div>

              <div className='flex justify-center'>
                <div className='flex space-x-1'>
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className='w-2 h-2 bg-blue-600 rounded-full animate-bounce'
                      style={{
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: '0.6s'
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {step === 2  && (
          <Button
            type='button'
            variant='ghost'
            onClick={goBack}
            className='w-full'
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

      <AlertLoginError
        error={error}
        setError={setError}
      />
    </Card>
  );
};