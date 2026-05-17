import React, { useEffect, useState } from "react";
import { adminAxios } from "./api";
import { Page, Card, Btn, Input, Textarea, Label } from "./ui";
import { toast } from "sonner";
import { Trash2, ChevronUp, ChevronDown } from "lucide-react";

export default function AdminFAQs() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = () => adminAxios.get("/admin/faqs").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      if (editing.id) await adminAxios.put(`/admin/faqs/${editing.id}`, editing);
      else await adminAxios.post("/admin/faqs", editing);
      toast.success("Saved."); setEditing(null); load();
    } catch { toast.error("Save failed."); }
  };

  const del = async (id) => { if (!window.confirm("Delete?")) return; await adminAxios.delete(`/admin/faqs/${id}`); load(); };
  const toggleActive = async (f) => { await adminAxios.put(`/admin/faqs/${f.id}`, { ...f, active: !f.active }); load(); };
  const move = async (idx, dir) => {
    const newOrder = [...items];
    const target = idx + dir;
    if (target < 0 || target >= newOrder.length) return;
    [newOrder[idx], newOrder[target]] = [newOrder[target], newOrder[idx]];
    setItems(newOrder);
    await adminAxios.post("/admin/faqs/reorder", newOrder.map((x) => x.id));
  };

  if (editing) {
    return (
      <Page eyebrow="FAQS · EDITOR" title={editing.id ? "Edit FAQ" : "New FAQ"} actions={<><Btn variant="ghost" onClick={() => setEditing(null)}>Cancel</Btn><Btn onClick={save}>Save</Btn></>}>
        <Card className="p-8 max-w-3xl space-y-5">
          <div><Label>Question</Label><Input value={editing.question} onChange={(e) => setEditing({ ...editing, question: e.target.value })} /></div>
          <div><Label>Answer (HTML allowed)</Label><Textarea value={editing.answer} onChange={(e) => setEditing({ ...editing, answer: e.target.value })} rows={8} /></div>
          <label className="flex items-center gap-2 text-[13px]"><input type="checkbox" checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} /> Active (visible on public site)</label>
        </Card>
      </Page>
    );
  }

  return (
    <Page eyebrow="CONTENT" title="FAQs" actions={<Btn onClick={() => setEditing({ question: "", answer: "", display_order: items.length, active: true })}>New FAQ</Btn>}>
      <Card>
        <ul className="divide-y divide-[#EEE]">
          {items.length === 0 && <li className="p-8 text-center text-[#888]">No FAQs yet.</li>}
          {items.map((f, i) => (
            <li key={f.id} className="p-4 flex items-start gap-4">
              <div className="flex flex-col gap-1">
                <button onClick={() => move(i, -1)} disabled={i === 0} className="text-[#888] hover:text-[#111] disabled:opacity-30"><ChevronUp size={14} /></button>
                <button onClick={() => move(i, 1)} disabled={i === items.length - 1} className="text-[#888] hover:text-[#111] disabled:opacity-30"><ChevronDown size={14} /></button>
              </div>
              <div className="flex-1">
                <div className="text-[15px] text-[#111] font-medium">{f.question}</div>
                <div className="text-[12px] text-[#666] mt-1 line-clamp-2" dangerouslySetInnerHTML={{ __html: f.answer }} />
              </div>
              <label className="flex items-center gap-2 text-[11px] uppercase tracking-[0.1em] text-[#666]"><input type="checkbox" checked={f.active} onChange={() => toggleActive(f)} /> Active</label>
              <button onClick={() => setEditing(f)} className="text-[11px] tracking-[0.1em] uppercase text-[#111] hover:underline">Edit</button>
              <button onClick={() => del(f.id)} className="text-[#8B1A1A]"><Trash2 size={14} /></button>
            </li>
          ))}
        </ul>
      </Card>
    </Page>
  );
}
