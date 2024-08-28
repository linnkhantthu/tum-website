import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "TUM: Logout",
  description: "Logging out.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
