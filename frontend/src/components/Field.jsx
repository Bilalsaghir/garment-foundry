import React, { useEffect, useState } from "react";

// BL-H + motion: `id` props the htmlFor link between <label> and the inner
// control, and is propagated to the child input via cloneElement so callers
// only declare it once. `required` is similarly propagated so the native HTML
// attribute is set on the actual <input>, not just rendered as a visual "*"
// decoration. A one-shot horizontal shake fires on the rising edge of an
// error (handled by the .gf-shake class — see index.css for the keyframe).
export const Field = ({ id, label, required, error, hint, children, testId }) => {
  const child = React.Children.only(children);
  const inputId = id || child.props.id;
  const cloned = React.cloneElement(child, {
    id: inputId,
    required: required || child.props.required,
    "aria-invalid": child.props["aria-invalid"] ?? (error ? true : undefined),
    "aria-describedby": error && testId ? `${testId}-error` : child.props["aria-describedby"],
  });

  const [shaking, setShaking] = useState(false);
  useEffect(() => {
    if (!error) return;
    setShaking(true);
    const t = setTimeout(() => setShaking(false), 360);
    return () => clearTimeout(t);
  }, [error]);

  return (
    <div data-testid={testId} className={`space-y-2 ${shaking ? "gf-shake" : ""}`}>
      <label htmlFor={inputId} className="block font-body text-[10px] tracking-[0.12em] uppercase text-[#888]">
        {label}{required && <span className="text-[#888] ml-1" aria-hidden="true">*</span>}
      </label>
      {cloned}
      {error && (
        <p id={testId ? `${testId}-error` : undefined} data-testid={`${testId}-error`} className="font-body italic text-[11px] text-[#8B1A1A]">
          {error}
        </p>
      )}
      {hint && !error && <p className="font-body text-[11px] text-[#666]">{hint}</p>}
    </div>
  );
};

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
