'use client'

import { motion } from 'motion/react';

export const AnimatedCheck = () => (
  <motion.svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <motion.path
      d='M5 13L9 17L19 7'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.4 }}
    />
  </motion.svg>
);