import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminAxios } from "./api";
import { Page, Card, Badge } from "./ui";
import { AlertTriangle } from "lucide-react";

export default function AdminDashboard() {
  const [d, setD] = useState(null);
  useEffect(() => { adminAxios.get("/admin/dashboard").then((r) => setD(r.data)); }, []);
  if (!d) return <p className="text-[#888] font-body text-[13px]">Loading…</p>;

  return (
    <Page eyebrow="OVERVIEW" title="Dashboard">
      {!d.sendgrid_configured && (
        <div className="flex items-center gap-3 bg-[#FEF3C7] border border-[#F59E0B] text-[#92400E] p-4 mb-8" data-testid="sendgrid-warning">
          <AlertTriangle size={18} />
          <div className="font-body text-[13px]">
            <strong>SendGrid API key not configured.</strong> Email sends will be queued. Add <code>SENDGRID_API_KEY</code> to backend env and restart.
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <Stat title="New Quotes (7d)" value={d.quotes_week} to="/admin/quotes" />
        <Stat title="Unread Contacts" value={d.unread_contacts} to="/admin/contacts" />
        <Stat title="Active Subscribers" value={d.active_subscribers} to="/admin/subscribers" />
        <Stat title="New This Month" value={d.new_subscribers_month} to="/admin/subscribers" />
      </div>

      {d.last_campaign && (
        <Card className="p-6 mb-10">
          <div className="font-body text-[10px] tracking-[0.2em] uppercase text-[#888]">LAST CAMPAIGN</div>
          <div className="mt-2 flex items-center justify-between">
            <div>
              <div className="font-display text-xl text-[#111]">{d.last_campaign.name}</div>
              <div className="text-[12px] text-[#666] mt-1">{d.last_campaign.recipients_count} recipients · sent {d.last_campaign.sent_at?.slice(0, 10)}</div>
            </div>
            <Badge tone="success">SENT</Badge>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="font-display text-lg text-[#111] mb-4">Recent Quote Requests</h2>
          <table className="w-full text-[13px]">
            <thead><tr className="text-[10px] tracking-[0.15em] uppercase text-[#888] text-left"><th className="py-2">REF</th><th>Business</th><th>Status</th></tr></thead>
            <tbody>
              {d.recent_quotes.map((q) => (
                <tr key={q.reference} className="border-t border-[#EEE]">
                  <td className="py-3"><Link className="text-[#111] hover:underline" to={`/admin/quotes/${q.reference}`}>{q.reference}</Link></td>
                  <td>{q.business_name}</td>
                  <td><Badge tone={q.status === "new" ? "new" : q.status === "in_review" ? "review" : q.status === "quoted" ? "quoted" : "closed"}>{q.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card className="p-6">
          <h2 className="font-display text-lg text-[#111] mb-4">Recent Subscribers</h2>
          <table className="w-full text-[13px]">
            <thead><tr className="text-[10px] tracking-[0.15em] uppercase text-[#888] text-left"><th className="py-2">Email</th><th>Source</th></tr></thead>
            <tbody>
              {d.recent_subscribers.map((s) => (
                <tr key={s.email} className="border-t border-[#EEE]">
                  <td className="py-3 text-[#111]">{s.email}</td>
                  <td className="text-[#666] text-[12px]">{s.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </Page>
  );
}

const Stat = ({ title, value, to }) => (
  <Link to={to} className="block bg-white border border-[#E5E5E5] p-6 hover:border-[#111] transition-colors">
    <div className="font-body text-[10px] tracking-[0.2em] uppercase text-[#888]">{title}</div>
    <div className="mt-3 font-display text-4xl text-[#111]">{value}</div>
  </Link>
);
