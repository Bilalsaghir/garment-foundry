import React from "react";

export const Card = ({ children, className = "" }) => (
  <div className={`bg-white border border-[#E5E5E5] ${className}`}>{children}</div>
);

export const Page = ({ title, eyebrow, actions, children }) => (
  <div>
    <div className="flex items-end justify-between mb-8">
      <div>
        {eyebrow && <div className="font-body text-[10px] tracking-[0.2em] uppercase text-[#888]">{eyebrow}</div>}
        <h1 className="mt-1 font-display text-3xl text-[#111]">{title}</h1>
      </div>
      <div className="flex items-center gap-3">{actions}</div>
    </div>
    {children}
  </div>
);

export const Btn = ({ variant = "primary", className = "", ...props }) => {
  const base = "inline-flex items-center justify-center h-10 px-5 font-body text-[11px] tracking-[0.15em] uppercase transition-colors";
  const styles = {
    primary: "bg-[#0A0A0A] text-white hover:bg-black",
    secondary: "bg-white text-[#111] border border-[#111] hover:bg-[#111] hover:text-white",
    danger: "bg-white text-[#8B1A1A] border border-[#8B1A1A] hover:bg-[#8B1A1A] hover:text-white",
    ghost: "bg-transparent text-[#666] hover:text-[#111]",
  };
  return <button className={`${base} ${styles[variant]} ${className}`} {...props} />;
};

export const Badge = ({ tone = "default", children }) => {
  const tones = {
    default: "bg-[#EEE] text-[#333]",
    new: "bg-[#FEF3C7] text-[#92400E]",
    review: "bg-[#DBEAFE] text-[#1E40AF]",
    quoted: "bg-[#D1FAE5] text-[#065F46]",
    closed: "bg-[#E5E5E5] text-[#555]",
    success: "bg-[#D1FAE5] text-[#065F46]",
    danger: "bg-[#FEE2E2] text-[#991B1B]",
    warning: "bg-[#FEF3C7] text-[#92400E]",
  };
  return <span className={`inline-flex items-center px-2.5 py-1 text-[10px] tracking-[0.1em] uppercase font-medium ${tones[tone] || tones.default}`}>{children}</span>;
};

export const Input = (props) => (
  <input {...props} className={`w-full bg-white border border-[#E5E5E5] focus:border-[#111] text-[#111] py-2.5 px-3 font-body text-[13px] outline-none transition-colors ${props.className || ""}`} />
);

export const Textarea = (props) => (
  <textarea {...props} className={`w-full bg-white border border-[#E5E5E5] focus:border-[#111] text-[#111] py-2.5 px-3 font-body text-[13px] outline-none transition-colors resize-vertical min-h-[120px] ${props.className || ""}`} />
);

export const Select = (props) => (
  <select {...props} className={`w-full bg-white border border-[#E5E5E5] focus:border-[#111] text-[#111] py-2.5 px-3 font-body text-[13px] outline-none ${props.className || ""}`} />
);

export const Label = ({ children }) => (
  <label className="block font-body text-[10px] tracking-[0.15em] uppercase text-[#666] mb-2">{children}</label>
);
