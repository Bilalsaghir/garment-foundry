import React, { useEffect, useState } from "react";
import { adminAxios } from "./api";
import { Page, Card, Badge } from "./ui";
import { toast } from "sonner";
import { Trash2, Mail } from "lucide-react";

export default function AdminContacts() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const load = () => adminAxios.get("/admin/contacts").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const markRead = async (id) => { await adminAxios.patch(`/admin/contacts/${id}/read`); load(); };
  const del = async (id) => { if (!window.confirm("Delete?")) return; await adminAxios.delete(`/admin/contacts/${id}`); toast.success("Deleted."); setSelected(null); load(); };

  return (
    <Page eyebrow="LEADS" title="Contact Inbox">
      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-12 lg:col-span-5">
          {items.length === 0 ? <div className="p-8 text-center text-[#888]">No contact messages.</div> : (
            <ul className="divide-y divide-[#EEE] max-h-[70vh] overflow-y-auto">
              {items.map((c) => (
                <li key={c.id}>
                  <button onClick={() => { setSelected(c); if (!c.read) markRead(c.id); }} className={`w-full text-left p-4 hover:bg-[#FAFAFA] ${selected?.id === c.id ? "bg-[#FAFAFA]" : ""}`}>
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-[#111]">{c.name}</div>
                      {!c.read && <Badge tone="new">NEW</Badge>}
                    </div>
                    <div className="text-[12px] text-[#888] mt-1">{c.email}</div>
                    <div className="text-[12px] text-[#666] mt-2 line-clamp-2">{c.message}</div>
                    <div className="text-[10px] tracking-[0.15em] uppercase text-[#999] mt-2">{c.created_at?.slice(0, 16).replace("T", " ")}</div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card className="col-span-12 lg:col-span-7 p-8 min-h-[70vh]">
          {selected ? (
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-display text-2xl text-[#111]">{selected.name}</h2>
                  <a href={`mailto:${selected.email}`} className="text-[13px] text-[#111] hover:underline mt-1 inline-flex items-center gap-2"><Mail size={13} />{selected.email}</a>
                  {selected.company && <div className="text-[12px] text-[#666] mt-1">{selected.company}</div>}
                </div>
                <button onClick={() => del(selected.id)} className="text-[#8B1A1A] hover:text-[#991B1B]"><Trash2 size={16} /></button>
              </div>
              <div className="mt-6 pt-6 border-t border-[#EEE] text-[14px] leading-[1.85] text-[#333] whitespace-pre-wrap">{selected.message}</div>
            </div>
          ) : <p className="text-[#888]">Select a message to read.</p>}
        </Card>
      </div>
    </Page>
  );
}
