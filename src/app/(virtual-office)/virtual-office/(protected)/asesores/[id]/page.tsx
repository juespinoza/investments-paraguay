import { notFound } from "next/navigation";
import { AdvisorForm } from "@/components/virtualoffice/advisors/AdvisorForm";
import { cookies } from "next/headers";

type PageProps = { params: Promise<{ id: string }> };

async function getAdvisor(id: string) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/virtualoffice/advisors/${id}`,
    {
      cache: "no-store",
      headers: { "Content-Type": "application/json", cookie: cookieHeader },
    }
  );
  // console.log("Fetch advisor response status:", res.status);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load advisor");
  return res.json();
}

export default async function EditAdvisorPage({ params }: PageProps) {
  const { id } = await params;
  console.log("Loading advisor edit page for id:", id);

  const data = await getAdvisor(id);
  if (!data) notFound();

  return (
    <div className="container-page container-narrow py-8">
      <AdvisorForm mode="edit" advisorId={id} initialData={data} />
    </div>
  );
}
