import TopbarMain from "@/features/ui/Topbar/TopbarMain";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen overflow-hidden">
      <TopbarMain pageType="Kasir" />
      <main>{children}</main>
    </div>
  );
}
