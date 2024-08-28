import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "TUM: Please verify",
  description: "Please verify to use further features.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
