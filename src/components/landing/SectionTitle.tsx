export function SectionTitle({
  title,
  subtitle,
  align = "center",
}: {
  title: string;
  subtitle: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "left" ? "text-left" : "text-center"}>
      <h2 className="text-3xl font-semibold tracking-tight text-light md:text-5xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-4 max-w-2xl text-base text-secondary md:text-lg">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
