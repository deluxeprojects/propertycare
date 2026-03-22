import Link from 'next/link';
import { siteConfig } from '@/config/site';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  href?: string;
}

export function Logo({ size = 'md', href = '/' }: LogoProps) {
  const sizes = {
    sm: { box: 'h-6 w-6', text: 'text-xs', name: 'text-base' },
    md: { box: 'h-8 w-8', text: 'text-sm', name: 'text-xl' },
    lg: { box: 'h-10 w-10', text: 'text-base', name: 'text-2xl' },
  };

  const s = sizes[size];

  return (
    <Link href={href} className="flex items-center gap-2">
      <div className={`flex ${s.box} items-center justify-center rounded-lg bg-primary`}>
        <span className={`${s.text} font-bold text-primary-foreground`}>
          {siteConfig.name.charAt(0)}
        </span>
      </div>
      <span className={`${s.name} font-bold text-primary`}>{siteConfig.name}</span>
    </Link>
  );
}
