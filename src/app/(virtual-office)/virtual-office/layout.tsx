export default async function VirtualOfficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="container-page py-6 grid md:grid-cols-[240px_1fr] gap-6">
          <main className="rounded-xl bg-white p-4 border">{children}</main>
        </div>
      </body>
    </html>
  );
}
