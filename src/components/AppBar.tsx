"use client"
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React from 'react';

const AppBar = () => {
  const params = useSearchParams();
  return (
    <div className="flex justify-between items-center px-10 h-16 bg-zinc-700 text-white text-2xl font-bold z-50">
      <Link href={'/'}>
        DevBot
      </Link>
      <span className='text-sm font-light text-neutral-300'>
        Prompt: {params.get("prompt")}
      </span>
    </div>
  );
};

export default AppBar;
