import PublicHeader from "@/components/layouts/PublicHeader";
import Footer from "@/components/layouts/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <PublicHeader />
      {children}
      <Footer />
    </>
  );
}
