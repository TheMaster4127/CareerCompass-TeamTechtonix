
// src/components/PillInput.tsx
import { useState } from "react";
import type { KeyboardEvent } from "react";


export default function PillInput({
  label,
  values,
  setValues,
  placeholder,
}: {
  label: string;
  values: string[];
  setValues: (vals: string[]) => void;
  placeholder?: string;
}) {
  const [input, setInput] = useState("");

  function addValue(val: string) {
    const v = val.trim();
    if (!v) return;
    if (!values.includes(v)) setValues([...values, v]);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addValue(input);
      setInput("");
    } else if (e.key === "Backspace" && !input && values.length) {
      // quick remove last
      const next = [...values];
      next.pop();
      setValues(next);
    }
  }

  function remove(idx: number) {
    const next = [...values];
    next.splice(idx, 1);
    setValues(next);
  }

  return (
    <div>
      <label className="block text-sm font-semibold mb-1">{label}</label>
      <div className="w-full rounded-lg border border-gray-300 px-3 py-2">
        <div className="flex flex-wrap gap-2">
          {values.map((v, i) => (
            <span
              key={v + i}
              className="inline-flex items-center gap-2 rounded-full bg-cc-100 text-cc-800 px-3 py-1 text-sm"
            >
              {v}
              <button
                type="button"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => remove(i)}
                aria-label={`Remove ${v}`}
              >
                ×
              </button>
            </span>
          ))}
          <input
            className="flex-1 min-w-[160px] outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder || "Type and press Enter"}
          />
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        Press Enter or comma to add. Backspace to remove last.
      </p>
    </div>
  );
}
