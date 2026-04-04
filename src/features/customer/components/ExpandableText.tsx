'use client';

import { useState } from 'react';

interface ExpandableTextProps {
  text: string;
  maxLines?: number;
  className?: string;
}

export function ExpandableText({ text, maxLines = 3, className = '' }: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={className}>
      <p
        className="text-muted-foreground leading-relaxed"
        style={!expanded ? { WebkitLineClamp: maxLines, display: '-webkit-box', WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' } : {}}
      >
        {text}
      </p>
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-2 text-sm font-medium text-accent-text hover:underline"
      >
        {expanded ? 'View less' : 'View more'}
      </button>
    </div>
  );
}
