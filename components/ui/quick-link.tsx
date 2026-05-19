"use client";

import Link from 'next/link';
import type { AnchorHTMLAttributes, ReactNode } from 'react';

export function QuickLink({ href, children, className, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={className} {...props}>
      {children}
    </Link>
  );
}

export default QuickLink;
