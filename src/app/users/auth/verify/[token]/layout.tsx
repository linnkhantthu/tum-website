import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "TUM: Verify Token",
  description: "Verifying user token.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
