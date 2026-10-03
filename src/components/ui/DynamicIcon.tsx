import React from 'react';
import * as LucideIcons from 'lucide-react';
import type { LucideProps } from 'lucide-react';

export interface DynamicIconProps extends LucideProps {
  name: string;
  fallbackName?: string;
}

function toPascalCase(str: string): string {
  if (!str) return '';
  return str
    .replace(/(^\w|-\w)/g, (clear) => clear.replace('-', '').toUpperCase());
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({
  name,
  fallbackName = 'Sparkles',
  ...props
}) => {
  const iconRecord = LucideIcons as unknown as Record<string, React.ComponentType<LucideProps>>;

  // Try direct match, then PascalCase match
  const pascalName = toPascalCase(name);
  const Component =
    iconRecord[name] ||
    iconRecord[pascalName] ||
    iconRecord[fallbackName] ||
    LucideIcons.Sparkles ||
    LucideIcons.CheckCircle2;

  if (!Component) {
    return null;
  }

  return <Component {...props} />;
};
