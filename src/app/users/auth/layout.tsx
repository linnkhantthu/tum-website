import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "TUM: Authenticate",
  description: "Authtenticate here.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
