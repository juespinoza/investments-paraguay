import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function AsesorLayout({ children }: Props) {
  return <div>{children}</div>;
}
