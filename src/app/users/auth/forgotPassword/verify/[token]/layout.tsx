import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "TUM: Verify Password Token",
  description: "Verifying password token.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
