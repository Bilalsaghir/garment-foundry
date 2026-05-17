import React, { useEffect, useState } from "react";
import { adminAxios } from "./api";
import { Page, Card, Btn, Input, Textarea, Label } from "./ui";
import { toast } from "sonner";

const FIELDS = [
  ["contact_email", "Contact Email", "input"],
  ["contact_phone", "Contact Phone", "input"],
  ["contact_address", "Contact Address", "input"],
  ["hero_headline", "Hero Headline", "input"],
  ["hero_subheading", "Hero Subheading", "textarea"],
  ["footer_tagline", "Footer Tagline", "input"],
  ["social_instagram", "Instagram URL", "input"],
  ["social_linkedin", "LinkedIn URL", "input"],
  ["social_twitter", "Twitter URL", "input"],
  ["quote_confirmation_subject", "Quote Confirmation — Subject", "input"],
  ["quote_confirmation_body", "Quote Confirmation — Body (HTML, merge tags {{name}}, {{reference}}, {{garment_type}})", "textarea"],
  ["admin_notification_body", "Admin Notification — Body (HTML)", "textarea"],
];

export default function AdminSettings() {
  const [data, setData] = useState(null);

  useEffect(() => { adminAxios.get("/admin/settings").then((r) => setData(r.data || {})); }, []);

  const save = async () => {
    try {
      await adminAxios.put("/admin/settings", { data });
      toast.success("Settings saved.");
    } catch { toast.error("Save failed."); }
  };

  if (!data) return <p className="text-[#888] font-body text-[13px]">Loading…</p>;

  return (
    <Page eyebrow="CONFIG" title="Site Settings" actions={<Btn onClick={save}>Save Settings</Btn>}>
      <Card className="p-8 max-w-3xl space-y-5">
        {FIELDS.map(([key, label, type]) => (
          <div key={key}>
            <Label>{label}</Label>
            {type === "input"
              ? <Input value={data[key] || ""} onChange={(e) => setData({ ...data, [key]: e.target.value })} />
              : <Textarea value={data[key] || ""} onChange={(e) => setData({ ...data, [key]: e.target.value })} rows={key.includes("body") ? 10 : 4} />
            }
          </div>
        ))}
      </Card>
    </Page>
  );
}
