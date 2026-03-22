import Link from 'next/link';
import { ProKeepLogo } from './ProKeepLogo';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  dark?: boolean;
  href?: string;
}

export function Logo({ size = 'sm', dark = false, href = '/' }: LogoProps) {
  return (
    <Link href={href} className="inline-flex items-center">
      <ProKeepLogo size={size} dark={dark} />
    </Link>
  );
}
