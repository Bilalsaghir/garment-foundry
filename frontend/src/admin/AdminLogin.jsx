import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminAxios, setToken } from "./api";
import { toast } from "sonner";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await adminAxios.post("/admin/login", { email, password });
      if (r.data?.token) setToken(r.data.token);
      toast.success("Welcome back.");
      nav("/admin", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.detail || "Invalid credentials");
    } finally { setBusy(false); }
  };

  return (
    <div data-testid="page-admin-login" className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-md bg-[#111] border border-[#1f1f1f] p-10">
        <div className="font-body text-[10px] tracking-[0.2em] uppercase text-[#888]">GARMENT FOUNDRY · ADMIN</div>
        <h1 className="mt-3 font-display text-3xl text-[#F5F4F0]">Sign in</h1>
        <div className="mt-8 space-y-6">
          <div>
            <label className="font-body text-[10px] tracking-[0.15em] uppercase text-[#888]">Email</label>
            <input data-testid="admin-login-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full bg-black border-b border-[#333] focus:border-white text-[#F5F4F0] py-3 px-3 outline-none font-body text-[14px]" />
          </div>
          <div>
            <label className="font-body text-[10px] tracking-[0.15em] uppercase text-[#888]">Password</label>
            <input data-testid="admin-login-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full bg-black border-b border-[#333] focus:border-white text-[#F5F4F0] py-3 px-3 outline-none font-body text-[14px]" />
          </div>
          <button data-testid="admin-login-submit" type="submit" disabled={busy} className="w-full h-12 bg-[#F5F4F0] text-black font-body text-[11px] tracking-[0.2em] uppercase disabled:opacity-50">
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
}
