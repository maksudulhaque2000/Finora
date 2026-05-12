"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/components/loading';

export function QuickLink({ href, children, className, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const router = useRouter();
  const { setLoading } = useLoading();

  async function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    try {
      setLoading(true);
      await router.push(String(href));
    } finally {
      setLoading(false);
    }
  }

  return (
    <a href={String(href)} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
}

export default QuickLink;
