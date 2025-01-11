import { Outlet } from "react-router";

import AdminSidebar from "@/web/components/admin/admin-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/web/components/ui/sidebar";

export default function Admin() {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="container">
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
