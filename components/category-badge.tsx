import { Badge } from '@/components/ui/badge';

export function CategoryBadge({ name, color }: { name: string; color?: string }) {
  return (
    <Badge className="gap-2">
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color ?? '#d4a853' }} />
      {name}
    </Badge>
  );
}