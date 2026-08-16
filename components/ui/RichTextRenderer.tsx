"use client";
import React from "react";

interface RichTextProps {
  content: string;
  className?: string;
}

type BlockType =
  | { type: "heading1"; text: string }
  | { type: "heading2"; text: string }
  | { type: "heading3"; text: string }
  | { type: "bullet"; text: string }
  | { type: "number"; num: string; text: string }
  | { type: "hr" }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "paragraph"; text: string };

export const RichTextRenderer: React.FC<RichTextProps> = ({ content, className = "" }) => {
  if (!content) return null;

  // Clean out self-referential intro formulas if any slip through
  let cleanContent = content
    .replace(/^As a Senior Principal Legal Counsel with over three decades of practice,?\s*/i, "")
    .replace(/^As an AI Legal Companion,?\s*/i, "");

  const lines = cleanContent.split("\n");
  const blocks: BlockType[] = [];

  let currentTableLines: string[] = [];

  const flushTable = () => {
    if (currentTableLines.length > 0) {
      // Parse markdown table
      const parsedRows = currentTableLines
        .map((l) =>
          l
            .trim()
            .replace(/^\|/, "")
            .replace(/\|$/, "")
            .split("|")
            .map((cell) => cell.trim())
        )
        .filter((row) => row.some((c) => c.length > 0));

      // Filter out separator line like :--- | :--- | :---
      const dataRows = parsedRows.filter(
        (row) => !row.every((cell) => /^[:\-\s]+$/.test(cell))
      );

      if (dataRows.length > 0) {
        const headers = dataRows[0];
        const rows = dataRows.slice(1);
        blocks.push({ type: "table", headers, rows });
      }
      currentTableLines = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Table detection: line starts with | or contains |
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      currentTableLines.push(trimmed);
      continue;
    } else {
      flushTable();
    }

    if (!trimmed) {
      continue;
    }

    // Horizontal Rule (--- or ***)
    if (trimmed === "---" || trimmed === "***" || /^[\-\*]{3,}$/.test(trimmed)) {
      blocks.push({ type: "hr" });
      continue;
    }

    // Headings
    if (trimmed.startsWith("### ")) {
      blocks.push({ type: "heading3", text: trimmed.slice(4) });
      continue;
    }
    if (trimmed.startsWith("## ")) {
      blocks.push({ type: "heading2", text: trimmed.slice(3) });
      continue;
    }
    if (trimmed.startsWith("# ")) {
      blocks.push({ type: "heading1", text: trimmed.slice(2) });
      continue;
    }

    // Bullet List
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      blocks.push({ type: "bullet", text: trimmed.slice(2) });
      continue;
    }

    // Numbered List
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      blocks.push({ type: "number", num: numMatch[1], text: numMatch[2] });
      continue;
    }

    // Paragraph
    blocks.push({ type: "paragraph", text: trimmed });
  }
  flushTable();

  // Helper to render inline formatting (**bold**, `code`, Risk badges)
  const renderFormattedInlineText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|__.*?__|`.*?`)/g);

    return parts.map((part, index) => {
      if ((part.startsWith("**") && part.endsWith("**")) || (part.startsWith("__") && part.endsWith("__"))) {
        const cleanBold = part.slice(2, -2);

        // Highlight Risk Ratings inside bold text
        if (/^(High|Critical)\b/i.test(cleanBold)) {
          return (
            <span key={index} className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-red-50 text-red-700 border border-red-200 mx-0.5">
              {cleanBold}
            </span>
          );
        }
        if (/^(Medium)\b/i.test(cleanBold)) {
          return (
            <span key={index} className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 mx-0.5">
              {cleanBold}
            </span>
          );
        }
        if (/^(Low|Standard|Neutral)\b/i.test(cleanBold)) {
          return (
            <span key={index} className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 mx-0.5">
              {cleanBold}
            </span>
          );
        }

        return (
          <strong key={index} className="font-bold text-[#0F172A]">
            {cleanBold}
          </strong>
        );
      }

      if (part.startsWith("`") && part.endsWith("`")) {
        const cleanCode = part.slice(1, -1);
        return (
          <code key={index} className="bg-slate-100 text-blue-900 font-mono text-[11px] px-1.5 py-0.5 rounded border border-slate-200">
            {cleanCode}
          </code>
        );
      }

      return part;
    });
  };

  return (
    <div className={`space-y-2.5 text-xs sm:text-sm leading-relaxed text-slate-800 ${className}`}>
      {blocks.map((block, idx) => {
        switch (block.type) {
          case "hr":
            return <div key={idx} className="my-3 border-t border-slate-200/60" />;

          case "heading1":
            return (
              <h2 key={idx} className="text-lg font-black text-[#0F172A] mt-4 mb-2 tracking-tight border-b border-slate-200 pb-1.5">
                {renderFormattedInlineText(block.text)}
              </h2>
            );

          case "heading2":
            return (
              <h3 key={idx} className="text-base font-extrabold text-[#0F172A] mt-4 mb-1.5 tracking-tight border-b border-slate-200 pb-1">
                {renderFormattedInlineText(block.text)}
              </h3>
            );

          case "heading3":
            return (
              <h4 key={idx} className="text-sm font-extrabold text-[#0F172A] mt-3.5 mb-1 tracking-tight border-b border-slate-100 pb-1">
                {renderFormattedInlineText(block.text)}
              </h4>
            );

          case "bullet":
            return (
              <div key={idx} className="flex items-start gap-2 ml-2 my-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1E3A8A] shrink-0 mt-2" />
                <div className="flex-1">{renderFormattedInlineText(block.text)}</div>
              </div>
            );

          case "number":
            return (
              <div key={idx} className="flex items-start gap-2 ml-2 my-1">
                <span className="w-5 h-5 rounded-full bg-blue-50 text-[#1E3A8A] border border-blue-200 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {block.num}
                </span>
                <div className="flex-1">{renderFormattedInlineText(block.text)}</div>
              </div>
            );

          case "table":
            return (
              <div key={idx} className="my-4 overflow-x-auto rounded-xl border border-slate-200 shadow-xs bg-white">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#0F172A] text-white text-xs font-bold uppercase tracking-wider">
                      {block.headers.map((h, hIdx) => (
                        <th key={hIdx} className="px-4 py-3 border-b border-slate-800">
                          {renderFormattedInlineText(h)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {block.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-blue-50/30 transition-colors even:bg-slate-50/50">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="px-4 py-3 align-top leading-relaxed">
                            {renderFormattedInlineText(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case "paragraph":
          default:
            return (
              <p key={idx} className="leading-relaxed">
                {renderFormattedInlineText(block.text)}
              </p>
            );
        }
      })}
    </div>
  );
};
