import React from "react";

export const Field = ({ label, required, error, hint, children, testId }) => (
  <div data-testid={testId} className="space-y-2">
    <label className="block font-body text-[10px] tracking-[0.12em] uppercase text-[#888]">
      {label}{required && <span className="text-[#888] ml-1">*</span>}
    </label>
    {children}
    {error && (
      <p data-testid={`${testId}-error`} className="font-body italic text-[11px] text-[#8B1A1A]">
        {error}
      </p>
    )}
    {hint && !error && <p className="font-body text-[11px] text-[#666]">{hint}</p>}
  </div>
);

export const TextInput = React.forwardRef(({ error, ...props }, ref) => (
  <input
    ref={ref}
    {...props}
    className={`w-full bg-[#111111] border-b ${
      error ? "border-b-2 border-[#8B1A1A]" : "border-[#333333] focus:border-[#FFFFFF]"
    } text-[#F5F4F0] font-body text-[14px] font-light py-3 px-3 outline-none transition-colors ${props.className || ""}`}
  />
));

export const TextArea = React.forwardRef(({ error, ...props }, ref) => (
  <textarea
    ref={ref}
    {...props}
    className={`w-full bg-[#111111] border-b ${
      error ? "border-b-2 border-[#8B1A1A]" : "border-[#333333] focus:border-[#FFFFFF]"
    } text-[#F5F4F0] font-body text-[14px] font-light py-3 px-3 outline-none transition-colors resize-vertical min-h-[120px] ${props.className || ""}`}
  />
));

TextInput.displayName = "TextInput";
TextArea.displayName = "TextArea";
