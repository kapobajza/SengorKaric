import { Outlet } from "react-router";

import AdminSidebar from "@/web/admin/components/admin-sidebar";
import { SidebarProvider } from "@/web/components/ui/sidebar";
import { AdminThemeProvider } from "@/web/admin/providers/admin-theme-provider";
import AdminHeader from "@/web/admin/components/admin-header";
import { api } from "@/web/networking/instance";
import { redirectToLogin } from "@/web/lib/session.server";

export async function action() {
  await api().authApi.logout();

  return redirectToLogin();
}

export default function AdminLayout() {
  return (
    <AdminThemeProvider>
      <SidebarProvider>
        <AdminSidebar />
        <main className="w-full sm:peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon))] sm:peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]">
          <AdminHeader />
          <div className="mt-11">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </AdminThemeProvider>
  );
}
