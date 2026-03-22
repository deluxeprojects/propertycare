'use client';

interface ServiceContentProps {
  content: string;
  suffix?: string;
}

export function ServiceContent({ content, suffix }: ServiceContentProps) {
  if (!content) return null;

  const paragraphs = content.split('\n\n').filter(p => p.trim());

  return (
    <div className="space-y-4">
      {paragraphs.map((paragraph, i) => {
        const trimmed = paragraph.trim();

        // Check if this paragraph is a heading (ends with : or starts with "What" and contains :)
        if (trimmed.endsWith(':') || (trimmed.startsWith('What') && trimmed.includes(':'))) {
          return (
            <h3 key={i} className="mt-2 text-lg font-semibold text-foreground">
              {trimmed}
            </h3>
          );
        }

        // Check if paragraph contains bullet points
        const lines = trimmed.split('\n');
        const hasBullets = lines.some(l => l.trim().startsWith('•') || l.trim().startsWith('-'));

        if (hasBullets) {
          return (
            <ul key={i} className="space-y-1.5 pl-1">
              {lines.filter(l => l.trim()).map((line, j) => {
                const text = line.trim().replace(/^[•\-]\s*/, '');
                return (
                  <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {text}
                  </li>
                );
              })}
            </ul>
          );
        }

        // Regular paragraph — append suffix to the last paragraph
        const isLast = i === paragraphs.length - 1;
        return (
          <p key={i} className="text-sm leading-relaxed text-muted-foreground">
            {trimmed}{isLast && suffix ? suffix : ''}
          </p>
        );
      })}
    </div>
  );
}
