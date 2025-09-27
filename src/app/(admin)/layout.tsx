import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
        <AdminSidebar />
        <main className="flex-1 p-4 md:p-8 bg-muted/40 min-h-screen">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
    </SidebarProvider>
  );
}
