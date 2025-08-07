'use client'

import { quotes } from '@/lib/quotes';
import { Quote } from 'lucide-react';

export default function RandomQuotes() {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return(
    <div className='xl:flex flex-col justify-end items-end w-2xl hidden'>
      <Quote className='-mr-8 size-12 text-white fill-white mb-2' />

      <p className='text-4xl text-white  italic font-bold'>{randomQuote.text}</p>
      <p className='mt-2 text-lg text-end font-semibold text-white/90'>— {randomQuote.author}</p>
    </div>
  );
};