// src/app/(virtual-office)/virtual-office/login/page.tsx
import LoginClient from "./LoginClient";

type SearchParams = { [key: string]: string | string[] | undefined };

export default function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const next =
    typeof searchParams?.next === "string" &&
    searchParams.next.trim().length > 0
      ? searchParams.next
      : "/virtual-office";

  return <LoginClient nextUrl={next} />;
}
