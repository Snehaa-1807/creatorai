import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default async function AppShellLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <DashboardNav />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <main style={{ flex: 1, overflowX: "hidden", minHeight: "calc(100vh - 57px)" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
