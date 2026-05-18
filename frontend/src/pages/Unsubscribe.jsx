import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PageMeta from "@/components/PageMeta";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Unsubscribe() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [status, setStatus] = useState("processing");

  useEffect(() => {
    if (!token) { setStatus("error"); return; }
    axios.get(`${API}/unsubscribe?token=${token}`)
      .then((r) => setStatus(r.data?.ok ? "done" : "error"))
      .catch(() => setStatus("error"));
  }, [token]);

  return (
    <div data-testid="page-unsubscribe" className="bg-black min-h-screen pt-40 pb-32 px-6 text-center">
      <PageMeta path="/unsubscribe" title="Unsubscribe | Garment Foundry" description="Unsubscribe from Garment Foundry communications." noindex />
      <div className="max-w-xl mx-auto">
        <h1 className="font-display text-3xl lg:text-4xl text-[#F5F4F0]">
          {status === "processing" && "Processing…"}
          {status === "done" && "You have been unsubscribed."}
          {status === "error" && "Invalid unsubscribe link."}
        </h1>
        <p className="mt-6 font-body text-[14px] leading-[1.9] text-[#bbb]">
          {status === "done" && "You will no longer receive emails from Garment Foundry. We are sorry to see you go."}
          {status === "error" && "Please contact us if you continue to receive emails."}
        </p>
        <Link to="/" className="gf-btn gf-btn-light mt-10 inline-flex">Return to site</Link>
      </div>
    </div>
  );
}
