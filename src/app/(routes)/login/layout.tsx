import TopbarLogin from "@/features/ui/Topbar/TopbarLogin";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen overflow-hidden">
      <TopbarLogin />
      <main className="h-[calc(100vh-80px)] overflow-hidden">{children}</main>
    </div>
  );
}
