import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "TUM: Create new article",
  description: "Creating a new article.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
