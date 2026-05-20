import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { adminAxios, clearToken, getToken } from "./api";
import { LayoutDashboard, FileText, Briefcase, Inbox, MessageSquare, HelpCircle, Users, Send, Settings, LogOut } from "lucide-react";

const ITEMS = [
  { to: "/admin", label: "Dashboard", end: true, icon: LayoutDashboard },
  { to: "/admin/blog", label: "Blog", icon: FileText },
  { to: "/admin/case-studies", label: "Case Studies", icon: Briefcase },
  { to: "/admin/quotes", label: "Quote Inbox", icon: Inbox },
  { to: "/admin/contacts", label: "Contact Inbox", icon: MessageSquare },
  { to: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { to: "/admin/subscribers", label: "Subscribers", icon: Users },
  { to: "/admin/campaigns", label: "Campaigns", icon: Send },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout() {
  const [authed, setAuthed] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    if (!getToken()) { nav("/admin/login", { replace: true }); return; }
    adminAxios.get("/admin/me").then(() => setAuthed(true)).catch(() => { setAuthed(false); nav("/admin/login", { replace: true }); });
  }, [nav]);

  const logout = async () => {
    try { await adminAxios.post("/admin/logout"); } catch {}
    clearToken();
    nav("/admin/login", { replace: true });
  };

  if (authed === null) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-[#888] font-body text-[13px]">Loading…</div>;
  if (!authed) return null;

  return (
    <div data-testid="admin-layout" className="min-h-screen flex bg-[#FAFAFA]">
      <aside className="w-64 bg-[#111111] text-white flex flex-col fixed inset-y-0">
        <div className="p-6 border-b border-[#1f1f1f]">
          <div className="font-display text-lg tracking-[0.15em]">GF</div>
          <div className="font-body text-[10px] tracking-[0.2em] uppercase text-[#888] mt-1">ADMIN PANEL</div>
        </div>
        <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
          {ITEMS.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.end}
              data-testid={`admin-nav-${it.label.replace(/\s+/g, '').toLowerCase()}`}
              className={({ isActive }) => `flex items-center gap-3 px-6 py-3 font-body text-[12px] tracking-[0.06em] uppercase transition-colors ${isActive ? "bg-[#1a1a1a] text-white border-l-2 border-white" : "text-[#bbb] hover:bg-[#1a1a1a] hover:text-white border-l-2 border-transparent"}`}
            >
              <it.icon size={15} />
              {it.label}
            </NavLink>
          ))}
        </nav>
        <button onClick={logout} data-testid="admin-logout" className="flex items-center gap-3 px-6 py-4 font-body text-[12px] tracking-[0.06em] uppercase text-[#999] hover:bg-[#1a1a1a] border-t border-[#1f1f1f]">
          <LogOut size={15} /> Sign out
        </button>
      </aside>
      <main className="ml-64 flex-1 p-10 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
