import React, { useEffect, useState } from "react";
import { adminAxios } from "./api";
import { Page, Card, Badge, Btn, Input, Textarea, Select, Label } from "./ui";
import { toast } from "sonner";
import { Trash2, Eye } from "lucide-react";

const BLANK = { title: "", slug: "", excerpt: "", body: "", cover_image: "", category: "", tags: [], status: "draft" };

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [tagInput, setTagInput] = useState("");

  const load = () => adminAxios.get("/admin/blog").then((r) => setPosts(r.data));
  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      if (editing.id) await adminAxios.put(`/admin/blog/${editing.id}`, editing);
      else await adminAxios.post("/admin/blog", editing);
      toast.success("Post saved.");
      setEditing(null); load();
    } catch (err) { toast.error("Save failed."); }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    await adminAxios.delete(`/admin/blog/${id}`); toast.success("Deleted."); load();
  };

  const togglePublish = async (p) => {
    await adminAxios.put(`/admin/blog/${p.id}`, { ...p, status: p.status === "published" ? "draft" : "published" });
    load();
  };

  if (editing) {
    return (
      <Page eyebrow="BLOG · EDITOR" title={editing.id ? "Edit Post" : "New Post"}
        actions={<>
          <Btn variant="ghost" onClick={() => setEditing(null)}>Cancel</Btn>
          <Btn data-testid="blog-save" onClick={save}>Save</Btn>
        </>}>
        <Card className="p-8 max-w-4xl">
          <div className="space-y-5">
            <div><Label>Title</Label><Input data-testid="blog-title" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
            <div><Label>Slug (auto if blank)</Label><Input value={editing.slug || ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} placeholder="my-post-slug" /></div>
            <div className="grid grid-cols-2 gap-5">
              <div><Label>Category</Label><Input value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} /></div>
              <div><Label>Status</Label><Select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })}><option value="draft">Draft</option><option value="published">Published</option></Select></div>
            </div>
            <div><Label>Cover image URL</Label><Input value={editing.cover_image} onChange={(e) => setEditing({ ...editing, cover_image: e.target.value })} placeholder="https://…" /></div>
            <div><Label>Excerpt (max 300 chars)</Label><Textarea maxLength={300} value={editing.excerpt} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} /></div>
            <div>
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {(editing.tags || []).map((t) => (
                  <button key={t} onClick={() => setEditing({ ...editing, tags: editing.tags.filter((x) => x !== t) })} className="bg-[#EEE] hover:bg-[#FEE2E2] text-[#333] hover:text-[#991B1B] text-[11px] tracking-[0.1em] uppercase px-3 py-1">{t} ×</button>
                ))}
              </div>
              <div className="flex gap-2"><Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="add a tag" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (tagInput.trim()) setEditing({ ...editing, tags: [...(editing.tags || []), tagInput.trim()] }); setTagInput(""); } }} />
                <Btn variant="secondary" onClick={() => { if (tagInput.trim()) { setEditing({ ...editing, tags: [...(editing.tags || []), tagInput.trim()] }); setTagInput(""); } }}>Add</Btn>
              </div>
            </div>
            <div><Label>Body (HTML allowed)</Label><Textarea data-testid="blog-body" value={editing.body} onChange={(e) => setEditing({ ...editing, body: e.target.value })} rows={14} placeholder="<p>Write your post here…</p>" /></div>
          </div>
        </Card>
      </Page>
    );
  }

  return (
    <Page eyebrow="CONTENT" title="Blog Posts" actions={<Btn data-testid="blog-new" onClick={() => setEditing({ ...BLANK })}>New Post</Btn>}>
      <Card>
        <table className="w-full">
          <thead className="bg-[#FAFAFA] border-b border-[#E5E5E5]">
            <tr className="text-[10px] tracking-[0.15em] uppercase text-[#888] text-left">
              <th className="p-4">Title</th><th>Status</th><th>Updated</th><th></th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-[#888]">No posts yet.</td></tr>}
            {posts.map((p) => (
              <tr key={p.id} className="border-t border-[#EEE] hover:bg-[#FAFAFA]" data-testid={`blog-row-${p.slug}`}>
                <td className="p-4">
                  <div className="font-medium text-[#111]">{p.title}</div>
                  <div className="text-[11px] text-[#888] mt-1">/{p.slug}</div>
                </td>
                <td><Badge tone={p.status === "published" ? "success" : "default"}>{p.status}</Badge></td>
                <td className="text-[12px] text-[#666]">{p.updated_at?.slice(0, 10)}</td>
                <td className="text-right pr-4 space-x-2">
                  <button onClick={() => togglePublish(p)} className="text-[11px] tracking-[0.1em] uppercase text-[#666] hover:text-[#111]" title="Toggle publish"><Eye size={14} className="inline mr-1" />{p.status === "published" ? "Unpublish" : "Publish"}</button>
                  <button onClick={() => setEditing(p)} className="text-[11px] tracking-[0.1em] uppercase text-[#111] hover:underline">Edit</button>
                  <button onClick={() => del(p.id)} className="text-[#8B1A1A] hover:text-[#991B1B]"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Page>
  );
}
