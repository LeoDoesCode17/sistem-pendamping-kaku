import TopbarLogin from "@/features/ui/Topbar/TopbarLogin";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <TopbarLogin />
      <main>{children}</main>
    </div>
  );
}
