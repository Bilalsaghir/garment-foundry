import React, { useEffect, useState } from "react";
import { adminAxios, API, getToken } from "./api";
import { Page, Card, Badge, Btn, Input, Select } from "./ui";
import { toast } from "sonner";
import { Download } from "lucide-react";

export default function AdminSubscribers() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const load = () => adminAxios.get("/admin/subscribers").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const unsub = async (s) => {
    if (!window.confirm(`Unsubscribe ${s.email}?`)) return;
    await adminAxios.delete(`/admin/subscribers/${s.id}`); toast.success("Unsubscribed."); load();
  };

  const exportCSV = async () => {
    const r = await fetch(`${API}/admin/subscribers/export.csv`, {
      headers: { Authorization: `Bearer ${getToken()}` },
      credentials: "include",
    });
    const blob = await r.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "subscribers.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = items.filter((s) =>
    (statusFilter === "all" || s.status === statusFilter) &&
    (!search || s.email.toLowerCase().includes(search.toLowerCase()) || (s.name || "").toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Page eyebrow="AUDIENCE" title="Subscribers" actions={<Btn onClick={exportCSV}><Download size={14} className="mr-2" />Export CSV</Btn>}>
      <Card className="p-4 mb-4 flex items-center gap-4">
        <Input placeholder="Search name or email…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-md" />
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="!w-48">
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="unsubscribed">Unsubscribed</option>
        </Select>
        <div className="text-[11px] tracking-[0.15em] uppercase text-[#888]">{filtered.length} results</div>
      </Card>

      <Card>
        <table className="w-full">
          <thead className="bg-[#FAFAFA] border-b border-[#E5E5E5]"><tr className="text-[10px] tracking-[0.15em] uppercase text-[#888] text-left"><th className="p-4">Name</th><th>Email</th><th>Source</th><th>Date</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-[#888]">No subscribers.</td></tr>}
            {filtered.map((s) => (
              <tr key={s.id} className="border-t border-[#EEE] hover:bg-[#FAFAFA]">
                <td className="p-4 text-[#111]">{s.name || "—"}</td>
                <td className="text-[13px]">{s.email}</td>
                <td className="text-[12px] text-[#666]">{s.source}</td>
                <td className="text-[12px] text-[#666]">{s.created_at?.slice(0, 10)}</td>
                <td><Badge tone={s.status === "active" ? "success" : "default"}>{s.status}</Badge></td>
                <td className="text-right pr-4">
                  {s.status === "active" && <button onClick={() => unsub(s)} className="text-[11px] tracking-[0.1em] uppercase text-[#8B1A1A] hover:underline">Unsubscribe</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Page>
  );
}
