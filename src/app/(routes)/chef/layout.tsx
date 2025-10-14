// app/chef/layout.tsx
import TopbarMain from "@/features/ui/Topbar/TopbarMain";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-100 h-screen overflow-hidden">
      {/* Topbar Fixed di atas */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <TopbarMain pageType="Chef" />
      </div>
      
      {/* Content dengan padding top untuk offset topbar */}
      <main className="pt-20 h-screen overflow-y-auto overscroll-contain">
        {children}
      </main>
    </div>
  );
}