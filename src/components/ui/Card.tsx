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
        "overflow-hidden rounded-sm border bg-white shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}
