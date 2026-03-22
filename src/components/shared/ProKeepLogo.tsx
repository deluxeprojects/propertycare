import { cn } from '@/lib/utils/cn';

type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ProKeepLogoProps {
  size?: LogoSize;
  dark?: boolean;
  showTagline?: boolean;
  showServices?: boolean;
  className?: string;
}

const sizeConfig: Record<LogoSize, {
  fontSize: number;
  roofSize: number;
  roofLeft: number;
  taglineFontSize: number;
  servicesFontSize: number;
  taglineMargin: number;
  servicesMargin: number;
}> = {
  xs: { fontSize: 13, roofSize: 6, roofLeft: 33, taglineFontSize: 7, servicesFontSize: 6, taglineMargin: 4, servicesMargin: 2 },
  sm: { fontSize: 18, roofSize: 8, roofLeft: 46, taglineFontSize: 9, servicesFontSize: 8, taglineMargin: 6, servicesMargin: 3 },
  md: { fontSize: 28, roofSize: 12, roofLeft: 72, taglineFontSize: 12, servicesFontSize: 10, taglineMargin: 8, servicesMargin: 4 },
  lg: { fontSize: 42, roofSize: 16, roofLeft: 108, taglineFontSize: 16, servicesFontSize: 12, taglineMargin: 10, servicesMargin: 5 },
  xl: { fontSize: 64, roofSize: 22, roofLeft: 165, taglineFontSize: 22, servicesFontSize: 16, taglineMargin: 14, servicesMargin: 8 },
};

export function ProKeepLogo({
  size = 'md',
  dark = false,
  showTagline = false,
  showServices = false,
  className,
}: ProKeepLogoProps) {
  const config = sizeConfig[size];

  const textColor = dark ? '#FFFFFF' : '#1A1A1A';
  const taglineColor = dark ? '#888888' : '#999999';
  const servicesColor = dark ? '#555555' : '#CCCCCC';
  const teal = '#4ECDC4';

  return (
    <div
      className={cn('inline-flex flex-col items-center', className)}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Wordmark with roof */}
      <div
        style={{
          position: 'relative',
          fontSize: config.fontSize,
          fontWeight: 500,
          letterSpacing: '0.2em',
          textTransform: 'uppercase' as const,
          color: textColor,
          lineHeight: 1,
          paddingTop: config.roofSize + 4,
        }}
      >
        {/* Roof chevron - positioned above the K */}
        <span
          style={{
            position: 'absolute',
            top: 0,
            left: config.roofLeft,
            width: config.roofSize,
            height: config.roofSize,
            borderLeft: `${Math.max(2, config.roofSize / 5)}px solid ${teal}`,
            borderTop: `${Math.max(2, config.roofSize / 5)}px solid ${teal}`,
            borderRight: 'none',
            borderBottom: 'none',
            transform: 'rotate(45deg)',
            borderRadius: '2px 0 0 0',
          }}
          aria-hidden="true"
        />
        PROKEEP
      </div>

      {/* Tagline */}
      {showTagline && (
        <div
          style={{
            marginTop: config.taglineMargin,
            fontSize: config.taglineFontSize,
            fontWeight: 400,
            letterSpacing: '0.25em',
            textTransform: 'uppercase' as const,
            color: taglineColor,
          }}
        >
          We Handle It.
        </div>
      )}

      {/* Services */}
      {showServices && (
        <div
          style={{
            marginTop: config.servicesMargin,
            fontSize: config.servicesFontSize,
            fontWeight: 400,
            letterSpacing: '0.15em',
            textTransform: 'uppercase' as const,
            color: servicesColor,
          }}
        >
          Maintenance
          <span style={{ color: teal, margin: '0 0.4em' }}>·</span>
          Cleaning
          <span style={{ color: teal, margin: '0 0.4em' }}>·</span>
          Pest Control
        </div>
      )}
    </div>
  );
}
