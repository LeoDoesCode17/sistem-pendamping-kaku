import TopbarMain from "@/features/ui/Topbar/TopbarMain";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-100">
      <TopbarMain pageType="Packager" />
      <main>{children}</main>
    </div>
  );
}
