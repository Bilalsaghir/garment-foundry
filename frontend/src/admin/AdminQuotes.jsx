import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { adminAxios } from "./api";
import { Page, Card, Badge, Btn, Textarea, Select, Label } from "./ui";
import { toast } from "sonner";
import { ArrowLeft, Paperclip } from "lucide-react";

const STATUSES = [
  { value: "new", label: "New", tone: "new" },
  { value: "in_review", label: "In Review", tone: "review" },
  { value: "quoted", label: "Quoted", tone: "quoted" },
  { value: "closed", label: "Closed", tone: "closed" },
];

export function AdminQuotes() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => { adminAxios.get("/admin/quotes").then((r) => setItems(r.data)); }, []);

  const filtered = filter === "all" ? items : items.filter((q) => q.status === filter);

  return (
    <Page eyebrow="LEADS" title="Quote Inbox" actions={
      <Select value={filter} onChange={(e) => setFilter(e.target.value)} className="!w-auto">
        <option value="all">All statuses</option>
        {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
      </Select>
    }>
      <Card>
        <table className="w-full">
          <thead className="bg-[#FAFAFA] border-b border-[#E5E5E5]"><tr className="text-[10px] tracking-[0.15em] uppercase text-[#888] text-left">
            <th className="p-4">Ref</th><th>Date</th><th>Business</th><th>Garment</th><th>Qty</th><th>Status</th></tr></thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-[#888]">No quote requests.</td></tr>}
            {filtered.map((q) => (
              <tr key={q.reference} className="border-t border-[#EEE] hover:bg-[#FAFAFA] cursor-pointer">
                <td className="p-4"><Link to={`/admin/quotes/${q.reference}`} className="text-[#111] font-medium hover:underline">{q.reference}</Link></td>
                <td className="text-[13px] text-[#666]">{q.created_at?.slice(0, 10)}</td>
                <td className="text-[13px] text-[#111]">{q.business_name}<div className="text-[11px] text-[#888]">{q.contact_name}</div></td>
                <td className="text-[12px] text-[#666]">{(q.garment_types || []).join(", ") || "—"}</td>
                <td className="text-[12px] text-[#666]">{q.quantity}</td>
                <td><Badge tone={STATUSES.find((s) => s.value === q.status)?.tone || "default"}>{q.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Page>
  );
}

export function AdminQuoteDetail() {
  const { ref } = useParams();
  const nav = useNavigate();
  const [q, setQ] = useState(null);
  const [note, setNote] = useState("");

  const load = () => adminAxios.get(`/admin/quotes/${ref}`).then((r) => setQ(r.data));
  useEffect(() => { load(); }, [ref]);

  if (!q) return <p className="text-[#888] font-body text-[13px]">Loading…</p>;

  const updateStatus = async (status) => {
    await adminAxios.patch(`/admin/quotes/${ref}`, { status, note: "" });
    toast.success(`Status → ${status}`); load();
  };

  const addNote = async () => {
    if (!note.trim()) return;
    await adminAxios.patch(`/admin/quotes/${ref}`, { status: q.status, note });
    toast.success("Note added."); setNote(""); load();
  };

  return (
    <Page eyebrow={q.reference} title={q.business_name} actions={<Btn variant="ghost" onClick={() => nav("/admin/quotes")}><ArrowLeft size={14} className="mr-2" />Back</Btn>}>
      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-12 lg:col-span-8 p-6">
          <h2 className="font-display text-xl text-[#111] mb-6">Submission Details</h2>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-4 text-[13px]">
            <Info label="Contact" value={q.contact_name} />
            <Info label="Email" value={<a href={`mailto:${q.email}`} className="text-[#111] underline">{q.email}</a>} />
            <Info label="Phone" value={q.phone || "—"} />
            <Info label="Website" value={q.website_instagram || "—"} />
            <Info label="Country" value={q.country || "—"} />
            <Info label="Delivery" value={q.delivery_country} />
            <Info label="Garments" value={(q.garment_types || []).join(", ") || "—"} />
            <Info label="Quantity" value={q.quantity} />
            <Info label="Fabric" value={q.fabric_preference} />
            <Info label="Branding" value={(q.branding || []).join(", ") || "—"} />
            <Info label="Packaging" value={q.packaging} />
            <Info label="Timeline" value={q.timeline} />
          </dl>
          <div className="mt-6 pt-6 border-t border-[#EEE]">
            <Label>Notes from customer</Label>
            <p className="text-[13px] text-[#333] whitespace-pre-wrap">{q.additional_notes || "—"}</p>
          </div>
          {q.uploaded_files?.length > 0 && (
            <div className="mt-6 pt-6 border-t border-[#EEE]">
              <Label>Attached Files</Label>
              <ul className="space-y-2">
                {q.uploaded_files.map((f) => (
                  <li key={f.id}>
                    <a href={`${process.env.REACT_APP_BACKEND_URL}/api/files/${f.id}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[13px] text-[#111] hover:underline">
                      <Paperclip size={13} />{f.original_filename} <span className="text-[11px] text-[#888]">({(f.size / 1024).toFixed(0)} KB)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <Card className="p-6">
            <Label>Status</Label>
            <div className="flex flex-col gap-2 mt-2">
              {STATUSES.map((s) => (
                <button key={s.value} onClick={() => updateStatus(s.value)} className={`text-left px-3 py-2 text-[12px] tracking-[0.1em] uppercase border ${q.status === s.value ? "border-[#111] bg-[#111] text-white" : "border-[#E5E5E5] text-[#333] hover:border-[#111]"}`}>
                  {s.label}
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <Label>Internal Notes</Label>
            <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
              {(q.notes_log || []).length === 0 && <p className="text-[12px] text-[#888]">No notes yet.</p>}
              {(q.notes_log || []).map((n, i) => (
                <div key={i} className="border-l-2 border-[#111] pl-3">
                  <div className="text-[10px] tracking-[0.15em] uppercase text-[#888]">{n.at?.slice(0, 16).replace("T", " ")}</div>
                  <div className="text-[13px] text-[#333] mt-1">{n.text}</div>
                </div>
              ))}
            </div>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add an internal note…" rows={3} />
            <Btn className="mt-3 w-full" onClick={addNote}>Add Note</Btn>
          </Card>
        </div>
      </div>
    </Page>
  );
}

const Info = ({ label, value }) => (
  <div>
    <dt className="font-body text-[10px] tracking-[0.15em] uppercase text-[#888]">{label}</dt>
    <dd className="mt-1 text-[#111]">{value}</dd>
  </div>
);
