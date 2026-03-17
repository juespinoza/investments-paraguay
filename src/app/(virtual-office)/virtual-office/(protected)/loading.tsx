function Pulse({
  className,
}: {
  className: string;
}) {
  return <div className={`animate-pulse rounded-2xl bg-zinc-200/70 ${className}`} />;
}

export default function VirtualOfficeLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Pulse className="h-4 w-28" />
        <Pulse className="h-9 w-56" />
        <Pulse className="h-5 w-full max-w-3xl" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-[1.75rem] border border-[rgba(24,39,63,0.08)] bg-white p-5 shadow-[0_18px_60px_rgba(15,23,38,0.06)]"
          >
            <Pulse className="h-3 w-20" />
            <Pulse className="mt-4 h-10 w-24" />
            <Pulse className="mt-4 h-4 w-full" />
          </div>
        ))}
      </div>

      <div className="rounded-[1.5rem] border border-[rgba(24,39,63,0.08)] bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          <Pulse className="h-11 flex-1" />
          <Pulse className="h-11 w-40" />
          <Pulse className="h-11 w-32" />
        </div>
      </div>

      <div className="overflow-hidden rounded-[1.75rem] border border-[rgba(24,39,63,0.08)] bg-white shadow-[0_18px_60px_rgba(15,23,38,0.06)]">
        <div className="grid grid-cols-5 gap-4 border-b border-zinc-100 bg-[#fcfaf6] px-4 py-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Pulse key={index} className="h-3 w-24" />
          ))}
        </div>
        <div className="space-y-4 px-4 py-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="grid grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((__, cellIndex) => (
                <Pulse key={cellIndex} className="h-5 w-full" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
