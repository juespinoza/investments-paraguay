export function SectionTitle({
  title,
  subtitle,
  align = "center",
  tone = "default",
}: {
  title: string;
  subtitle: string;
  align?: "left" | "center";
  tone?: "default" | "dark";
}) {
  return (
    <div className={align === "left" ? "text-left" : "text-center"}>
      <h2
        className={
          tone === "dark"
            ? "text-3xl font-semibold tracking-tight text-[var(--ivory)] md:text-5xl"
            : "text-3xl font-semibold tracking-tight text-primary md:text-5xl"
        }
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={
            tone === "dark"
              ? "mt-4 max-w-2xl text-base text-[rgba(250,250,248,0.78)] md:text-lg"
              : "mt-4 max-w-2xl text-base text-secondary md:text-lg"
          }
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
