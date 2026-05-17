import React, { useEffect, useState } from "react";
import { adminAxios } from "./api";
import { Page, Card, Badge, Btn, Input, Textarea, Select, Label } from "./ui";
import { toast } from "sonner";
import { Trash2, Copy, Eye } from "lucide-react";

const BLANK = { name: "", subject: "", preview_text: "", body: "", recipient_group: "active_only", scheduled_at: null };

export default function AdminCampaigns() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [preview, setPreview] = useState(null);

  const load = () => adminAxios.get("/admin/campaigns").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const save = async (asSend) => {
    try {
      const saved = editing.id
        ? (await adminAxios.put(`/admin/campaigns/${editing.id}`, editing), editing)
        : (await adminAxios.post("/admin/campaigns", editing)).data;
      if (asSend) {
        const id = editing.id || saved.id;
        const r = await adminAxios.post(`/admin/campaigns/${id}/send`);
        toast.success(r.data?.sendgrid_configured ? "Sending started." : "Saved as queued — SendGrid not configured.");
      } else {
        toast.success("Saved.");
      }
      setEditing(null); load();
    } catch { toast.error("Save failed."); }
  };

  const del = async (id) => { if (!window.confirm("Delete?")) return; await adminAxios.delete(`/admin/campaigns/${id}`); load(); };
  const duplicate = async (id) => { await adminAxios.post(`/admin/campaigns/${id}/duplicate`); toast.success("Duplicated."); load(); };

  if (editing) {
    return (
      <Page eyebrow="CAMPAIGNS · EDITOR" title={editing.id ? "Edit Campaign" : "New Campaign"} actions={
        <>
          <Btn variant="ghost" onClick={() => setEditing(null)}>Cancel</Btn>
          <Btn variant="secondary" onClick={() => setPreview(editing)}><Eye size={14} className="mr-2" />Preview</Btn>
          <Btn variant="secondary" onClick={() => save(false)}>Save Draft</Btn>
          <Btn onClick={() => save(true)}>Send Now</Btn>
        </>}>
        <Card className="p-8 max-w-4xl space-y-5">
          <div><Label>Campaign Name (internal)</Label><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
          <div><Label>Subject Line</Label><Input value={editing.subject} onChange={(e) => setEditing({ ...editing, subject: e.target.value })} /></div>
          <div><Label>Preview Text</Label><Input value={editing.preview_text} onChange={(e) => setEditing({ ...editing, preview_text: e.target.value })} /></div>
          <div><Label>Recipients</Label><Select value={editing.recipient_group} onChange={(e) => setEditing({ ...editing, recipient_group: e.target.value })}>
            <option value="active_only">Active subscribers only</option>
            <option value="all">All subscribers</option>
          </Select></div>
          <div>
            <Label>Body (HTML). Merge tags: <code className="bg-[#EEE] px-1">{"{{first_name}}"}</code>, <code className="bg-[#EEE] px-1">{"{{unsubscribe_url}}"}</code></Label>
            <Textarea value={editing.body} onChange={(e) => setEditing({ ...editing, body: e.target.value })} rows={16} placeholder="<p>Hello {{first_name}},</p>" />
          </div>
        </Card>

        {preview && (
          <div onClick={() => setPreview(null)} className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div onClick={(e) => e.stopPropagation()} className="bg-white max-w-2xl w-full max-h-[85vh] overflow-y-auto">
              <div className="p-6 border-b border-[#EEE]">
                <div className="font-body text-[10px] tracking-[0.15em] uppercase text-[#888]">SUBJECT</div>
                <div className="mt-1 text-[#111] font-display text-xl">{preview.subject || "(no subject)"}</div>
                {preview.preview_text && <div className="mt-1 text-[12px] text-[#666]">{preview.preview_text}</div>}
              </div>
              <div className="p-8 prose" dangerouslySetInnerHTML={{ __html: (preview.body || "").replace(/\{\{first_name\}\}/g, "Jane").replace(/\{\{unsubscribe_url\}\}/g, "#") }} />
            </div>
          </div>
        )}
      </Page>
    );
  }

  return (
    <Page eyebrow="EMAIL" title="Campaigns" actions={<Btn onClick={() => setEditing({ ...BLANK })}>New Campaign</Btn>}>
      <Card>
        <table className="w-full">
          <thead className="bg-[#FAFAFA] border-b border-[#E5E5E5]"><tr className="text-[10px] tracking-[0.15em] uppercase text-[#888] text-left">
            <th className="p-4">Name</th><th>Status</th><th>Recipients</th><th>Sent</th><th></th></tr></thead>
          <tbody>
            {items.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-[#888]">No campaigns yet.</td></tr>}
            {items.map((c) => (
              <tr key={c.id} className="border-t border-[#EEE] hover:bg-[#FAFAFA]">
                <td className="p-4">
                  <div className="font-medium text-[#111]">{c.name}</div>
                  <div className="text-[12px] text-[#888]">{c.subject}</div>
                </td>
                <td><Badge tone={c.status === "sent" ? "success" : c.status === "queued" ? "warning" : c.status === "failed" ? "danger" : "default"}>{c.status}</Badge></td>
                <td className="text-[12px] text-[#666]">{c.recipients_count || "—"}</td>
                <td className="text-[12px] text-[#666]">{c.sent_at ? c.sent_at.slice(0, 10) : "—"}</td>
                <td className="text-right pr-4 space-x-2">
                  <button onClick={() => duplicate(c.id)} className="text-[#666] hover:text-[#111]" title="Duplicate"><Copy size={14} /></button>
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
