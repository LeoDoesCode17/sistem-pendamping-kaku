import TopbarMain from "@/features/ui/Topbar/TopbarMain";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-100 h-screen overflow-hidden">
      <TopbarMain pageType="Packager" />
      <main className="pt-20 h-screen overflow-y-auto overscroll-contain">{children}</main>
    </div>
  );
}
