'use client'

import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { TypesLoginErrors } from '@/types/types-login-errors';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

type Props = {
  error: TypesLoginErrors | null,
  setError: Dispatch<SetStateAction<TypesLoginErrors | null>>
};

export function AlertLoginError({ error, setError }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (error !== null) {
      setOpen(true);
    };
  }, [error]);

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setError(null), 300);
  };

  const errorDetails = {
    title: error === 'USER_NOT_FOUND' ? 'Usuário não encontrado!' : 'Você não tem acesso',
    description: error === 'USER_NOT_FOUND'
      ? 'Não encontramos seu usuário no nosso banco de dados, contate seu gestor para solicitar o cadastro.'
      : 'Sua conta existe, porém você não tem permissão para acessar esse recurso.'
  };

  return(
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{errorDetails.title}</AlertDialogTitle>
          <AlertDialogDescription>{errorDetails.description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogAction>Entendi</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};