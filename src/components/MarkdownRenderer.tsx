import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  // Helper to parse inline styles (bold, italic, code, links)
  const renderInline = (text: string): React.ReactNode[] => {
    const nodes: React.ReactNode[] = [];
    let remaining = text;
    let keyIdx = 0;

    // Regex for inline code: `code`
    // Regex for bold-italic: ***text***
    // Regex for bold: **text** or __text__
    // Regex for italic: *text* or _text_
    // Regex for links: [text](url)
    while (remaining.length > 0) {
      // Inline code
      const codeMatch = remaining.match(/^`([^`]+)`/);
      if (codeMatch) {
        nodes.push(
          <code
            key={`code-${keyIdx++}`}
            className="px-1.5 py-0.5 rounded-md bg-zinc-800/80 text-amber-300 font-mono text-[12px] border border-zinc-700/50"
          >
            {codeMatch[1]}
          </code>
        );
        remaining = remaining.slice(codeMatch[0].length);
        continue;
      }

      // Bold & Italic (***text***)
      const boldItalicMatch = remaining.match(/^\*\*\*([^*]+)\*\*\*/);
      if (boldItalicMatch) {
        nodes.push(
          <strong key={`bi-${keyIdx++}`} className="font-bold italic text-zinc-100">
            {boldItalicMatch[1]}
          </strong>
        );
        remaining = remaining.slice(boldItalicMatch[0].length);
        continue;
      }

      // Bold (**text** or __text__)
      const boldMatch = remaining.match(/^(\*\*|__)(.*?)\1/);
      if (boldMatch) {
        nodes.push(
          <strong key={`b-${keyIdx++}`} className="font-semibold text-zinc-100">
            {boldMatch[2]}
          </strong>
        );
        remaining = remaining.slice(boldMatch[0].length);
        continue;
      }

      // Italic (*text* or _text_)
      const italicMatch = remaining.match(/^(\*|_)(.*?)\1/);
      if (italicMatch) {
        nodes.push(
          <em key={`i-${keyIdx++}`} className="italic text-zinc-300">
            {italicMatch[2]}
          </em>
        );
        remaining = remaining.slice(italicMatch[0].length);
        continue;
      }

      // Link [label](url)
      const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        nodes.push(
          <a
            key={`link-${keyIdx++}`}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors"
          >
            {linkMatch[1]}
          </a>
        );
        remaining = remaining.slice(linkMatch[0].length);
        continue;
      }

      // Normal text until next special character
      const nextSpecial = remaining.search(/[`*_\[]/);
      if (nextSpecial === -1) {
        nodes.push(remaining);
        break;
      } else if (nextSpecial === 0) {
        // Fallback single character
        nodes.push(remaining[0]);
        remaining = remaining.slice(1);
      } else {
        nodes.push(remaining.slice(0, nextSpecial));
        remaining = remaining.slice(nextSpecial);
      }
    }

    return nodes;
  };

  // Block level parser
  const renderBlocks = () => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let i = 0;
    let blockKey = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Code Block (```lang ... ```)
      if (line.trim().startsWith('```')) {
        const lang = line.trim().slice(3).trim();
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        i++; // skip closing ```
        const fullCode = codeLines.join('\n');

        elements.push(
          <CodeBlockItem
            key={`codeblock-${blockKey++}`}
            code={fullCode}
            language={lang || 'text'}
          />
        );
        continue;
      }

      // Table (| col1 | col2 |)
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
          tableLines.push(lines[i].trim());
          i++;
        }

        elements.push(
          <TableItem
            key={`table-${blockKey++}`}
            lines={tableLines}
            renderInline={renderInline}
          />
        );
        continue;
      }

      // Heading 1 (# ...)
      if (line.startsWith('# ')) {
        const text = line.slice(2).trim();
        elements.push(
          <h1 key={`h1-${blockKey++}`} className="text-xl font-bold text-white tracking-tight mt-5 mb-2.5">
            {renderInline(text)}
          </h1>
        );
        i++;
        continue;
      }

      // Heading 2 (## ...)
      if (line.startsWith('## ')) {
        const text = line.slice(3).trim();
        elements.push(
          <h2 key={`h2-${blockKey++}`} className="text-lg font-bold text-white tracking-tight mt-4 mb-2">
            {renderInline(text)}
          </h2>
        );
        i++;
        continue;
      }

      // Heading 3 (### ...)
      if (line.startsWith('### ')) {
        const text = line.slice(4).trim();
        elements.push(
          <h3 key={`h3-${blockKey++}`} className="text-sm font-semibold text-zinc-100 tracking-tight mt-3.5 mb-1.5 flex items-center gap-1.5">
            {renderInline(text)}
          </h3>
        );
        i++;
        continue;
      }

      // Heading 4 (#### ...)
      if (line.startsWith('#### ')) {
        const text = line.slice(5).trim();
        elements.push(
          <h4 key={`h4-${blockKey++}`} className="text-xs font-semibold text-zinc-200 mt-2.5 mb-1">
            {renderInline(text)}
          </h4>
        );
        i++;
        continue;
      }

      // Blockquote (> ...)
      if (line.startsWith('> ') || line === '>') {
        const quoteLines: string[] = [];
        while (i < lines.length && (lines[i].startsWith('> ') || lines[i] === '>')) {
          quoteLines.push(lines[i].replace(/^>\s?/, ''));
          i++;
        }
        elements.push(
          <blockquote
            key={`quote-${blockKey++}`}
            className="border-l-2 border-indigo-500/60 pl-3.5 py-1 my-2.5 text-zinc-300 italic text-xs leading-relaxed bg-zinc-900/30 rounded-r-md"
          >
            {quoteLines.map((ql, qIdx) => (
              <p key={qIdx}>{renderInline(ql)}</p>
            ))}
          </blockquote>
        );
        continue;
      }

      // Horizontal Rule (--- or ***)
      if (line.trim() === '---' || line.trim() === '***' || line.trim() === '___') {
        elements.push(
          <hr key={`hr-${blockKey++}`} className="my-4 border-zinc-800" />
        );
        i++;
        continue;
      }

      // Unordered list item (- ... or * ...)
      if (/^[-*]\s/.test(line.trim())) {
        const listItems: string[] = [];
        while (i < lines.length && /^[-*]\s/.test(lines[i].trim())) {
          listItems.push(lines[i].trim().replace(/^[-*]\s+/, ''));
          i++;
        }
        elements.push(
          <ul key={`ul-${blockKey++}`} className="space-y-1.5 my-2.5 pl-1">
            {listItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs leading-relaxed text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-1.5 shrink-0" />
                <span className="flex-1">{renderInline(item)}</span>
              </li>
            ))}
          </ul>
        );
        continue;
      }

      // Ordered list item (1. ...)
      if (/^\d+\.\s/.test(line.trim())) {
        const listItems: string[] = [];
        while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
          listItems.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
          i++;
        }
        elements.push(
          <ol key={`ol-${blockKey++}`} className="space-y-1.5 my-2.5 pl-1">
            {listItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs leading-relaxed text-zinc-300">
                <span className="font-mono text-[11px] text-zinc-400 shrink-0 mt-0.5 font-medium">
                  {idx + 1}.
                </span>
                <span className="flex-1">{renderInline(item)}</span>
              </li>
            ))}
          </ol>
        );
        continue;
      }

      // Empty line
      if (!line.trim()) {
        i++;
        continue;
      }

      // Regular Paragraph
      elements.push(
        <p key={`p-${blockKey++}`} className="text-xs leading-relaxed text-zinc-300 my-1.5">
          {renderInline(line)}
        </p>
      );
      i++;
    }

    return elements;
  };

  return <div className={`space-y-1 ${className}`}>{renderBlocks()}</div>;
};

// Code block item with copy button
const CodeBlockItem: React.FC<{ code: string; language: string }> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 font-mono text-xs">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-zinc-900/90 border-b border-zinc-800/80 text-[11px] text-zinc-400">
        <span className="font-medium text-zinc-300 uppercase tracking-wider text-[10px]">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>
      <div className="p-3.5 overflow-x-auto text-zinc-200 leading-relaxed font-mono whitespace-pre">
        {code}
      </div>
    </div>
  );
};

// Clean Markdown Table item
const TableItem: React.FC<{
  lines: string[];
  renderInline: (text: string) => React.ReactNode[];
}> = ({ lines, renderInline }) => {
  if (lines.length === 0) return null;

  const parseRow = (line: string) => {
    return line
      .split('|')
      .slice(1, -1)
      .map((c) => c.trim());
  };

  const headerRow = parseRow(lines[0]);
  const hasSeparator = lines.length > 1 && lines[1].includes('---');
  const dataRows = lines.slice(hasSeparator ? 2 : 1).map(parseRow);

  return (
    <div className="my-3.5 overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950/60 shadow-sm">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/80">
            {headerRow.map((cell, idx) => (
              <th key={idx} className="p-2.5 font-semibold text-zinc-200 whitespace-nowrap">
                {renderInline(cell)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/60">
          {dataRows.map((row, rIdx) => (
            <tr key={rIdx} className="hover:bg-zinc-900/40 transition-colors">
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="p-2.5 text-zinc-300 align-top">
                  {renderInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
