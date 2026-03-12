import { cn } from "@/lib/cn";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "surface-card overflow-hidden rounded-[1.75rem]",
        className,
      )}
    >
      {children}
    </div>
  );
}
