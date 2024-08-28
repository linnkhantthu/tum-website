import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "TUM: Articles",
  description: "Discover Articles at TUM Webpage",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
