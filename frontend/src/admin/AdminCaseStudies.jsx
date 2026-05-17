import React, { useEffect, useState } from "react";
import { adminAxios } from "./api";
import { Page, Card, Badge, Btn, Input, Textarea, Select, Label } from "./ui";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

const INDUSTRIES = ["Fashion", "Uniform", "Sportswear", "Workwear", "Streetwear", "Private Label"];
const BLANK = { title: "", client_name: "", anonymise_client: false, industry: "Fashion", challenge: "", solution: "", result: "", cover_image: "", status: "draft" };

export default function AdminCaseStudies() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = () => adminAxios.get("/admin/case-studies").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      if (editing.id) await adminAxios.put(`/admin/case-studies/${editing.id}`, editing);
      else await adminAxios.post("/admin/case-studies", editing);
      toast.success("Saved."); setEditing(null); load();
    } catch { toast.error("Save failed."); }
  };

  const del = async (id) => { if (!window.confirm("Delete?")) return; await adminAxios.delete(`/admin/case-studies/${id}`); toast.success("Deleted."); load(); };

  if (editing) {
    return (
      <Page eyebrow="CASE STUDIES · EDITOR" title={editing.id ? "Edit Case Study" : "New Case Study"} actions={<><Btn variant="ghost" onClick={() => setEditing(null)}>Cancel</Btn><Btn onClick={save}>Save</Btn></>}>
        <Card className="p-8 max-w-4xl space-y-5">
          <div><Label>Title</Label><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-5">
            <div><Label>Client Name</Label><Input value={editing.client_name} onChange={(e) => setEditing({ ...editing, client_name: e.target.value })} /></div>
            <div><Label>Industry</Label><Select value={editing.industry} onChange={(e) => setEditing({ ...editing, industry: e.target.value })}>{INDUSTRIES.map((i) => <option key={i}>{i}</option>)}</Select></div>
          </div>
          <label className="flex items-center gap-2 text-[13px]"><input type="checkbox" checked={editing.anonymise_client} onChange={(e) => setEditing({ ...editing, anonymise_client: e.target.checked })} /> Anonymise client (display as "Leading UK Brand")</label>
          <div><Label>Cover Image URL</Label><Input value={editing.cover_image} onChange={(e) => setEditing({ ...editing, cover_image: e.target.value })} /></div>
          <div><Label>Challenge</Label><Textarea value={editing.challenge} onChange={(e) => setEditing({ ...editing, challenge: e.target.value })} /></div>
          <div><Label>Solution</Label><Textarea value={editing.solution} onChange={(e) => setEditing({ ...editing, solution: e.target.value })} /></div>
          <div><Label>Result</Label><Textarea value={editing.result} onChange={(e) => setEditing({ ...editing, result: e.target.value })} /></div>
          <div><Label>Status</Label><Select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })}><option value="draft">Draft</option><option value="published">Published</option></Select></div>
        </Card>
      </Page>
    );
  }

  return (
    <Page eyebrow="CONTENT" title="Case Studies" actions={<Btn onClick={() => setEditing({ ...BLANK })}>New Case Study</Btn>}>
      <Card>
        <table className="w-full">
          <thead className="bg-[#FAFAFA] border-b border-[#E5E5E5]"><tr className="text-[10px] tracking-[0.15em] uppercase text-[#888] text-left"><th className="p-4">Title</th><th>Client</th><th>Industry</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {items.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-[#888]">No case studies yet.</td></tr>}
            {items.map((c) => (
              <tr key={c.id} className="border-t border-[#EEE] hover:bg-[#FAFAFA]">
                <td className="p-4 text-[#111] font-medium">{c.title}</td>
                <td className="text-[13px]">{c.anonymise_client ? "Anonymised" : c.client_name}</td>
                <td className="text-[13px] text-[#666]">{c.industry}</td>
                <td><Badge tone={c.status === "published" ? "success" : "default"}>{c.status}</Badge></td>
                <td className="text-right pr-4 space-x-3">
                  <button onClick={() => setEditing(c)} className="text-[11px] tracking-[0.1em] uppercase text-[#111] hover:underline">Edit</button>
                  <button onClick={() => del(c.id)} className="text-[#8B1A1A]"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Page>
  );
}
