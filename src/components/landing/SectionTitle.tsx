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
      <h2 className="text-4xl font-semibold">{title}</h2>
      {subtitle ? <p className="mt-3 text-secondary">{subtitle}</p> : null}
    </div>
  );
}
