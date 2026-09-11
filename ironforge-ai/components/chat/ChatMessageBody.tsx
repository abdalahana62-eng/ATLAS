'use client';

import React from 'react';

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  // **bold** → <strong>, keep it simple and safe (no dangerouslySetInnerHTML)
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**') && p.length > 4) {
      return (
        <strong key={`${keyPrefix}-${i}`} className="font-bold text-ironforge-primary">
          {p.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={`${keyPrefix}-${i}`}>{p}</React.Fragment>;
  });
}

export default function ChatMessageBody({
  content,
  isUser,
}: {
  content: string;
  isUser?: boolean;
}) {
  if (isUser) {
    return (
      <p className="text-[15px] font-medium leading-8 whitespace-pre-wrap break-words">
        {content}
      </p>
    );
  }

  const lines = content.split('\n');
  const blocks: React.ReactNode[] = [];
  let listBuffer: { type: 'bullet' | 'numbered'; items: string[] } | null = null;
  let key = 0;

  const flushList = () => {
    if (!listBuffer) return;
    const { type, items } = listBuffer;
    if (type === 'bullet') {
      blocks.push(
        <ul key={`b-${key++}`} className="my-2 space-y-2 pr-1">
          {items.map((it, idx) => (
            <li key={idx} className="flex gap-2 text-[15px] leading-8">
              <span className="mt-[13px] h-1.5 w-1.5 shrink-0 rounded-full bg-ironforge-primary" />
              <span className="flex-1">{renderInline(it, `ul-${key}-${idx}`)}</span>
            </li>
          ))}
        </ul>
      );
    } else {
      blocks.push(
        <ol key={`o-${key++}`} className="my-2 space-y-2 pr-1">
          {items.map((it, idx) => (
            <li key={idx} className="flex gap-2.5 text-[15px] leading-8">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ironforge-primary/15 text-[13px] font-bold text-ironforge-primary">
                {idx + 1}
              </span>
              <span className="flex-1">{renderInline(it, `ol-${key}-${idx}`)}</span>
            </li>
          ))}
        </ol>
      );
    }
    listBuffer = null;
  };

  lines.forEach((raw) => {
    const line = raw.trim();

    if (!line) {
      flushList();
      blocks.push(<div key={`sp-${key++}`} className="h-2" />);
      return;
    }

    // ## heading
    const h2 = line.match(/^##\s+(.*)/);
    if (h2) {
      flushList();
      blocks.push(
        <h3
          key={`h-${key++}`}
          className="mb-1 mt-3 border-r-[3px] border-ironforge-primary pr-3 text-[16px] font-extrabold leading-8 text-ironforge-text"
        >
          {renderInline(h2[1], `h-${key}`)}
        </h3>
      );
      return;
    }

    // ### heading
    const h3 = line.match(/^###\s+(.*)/);
    if (h3) {
      flushList();
      blocks.push(
        <h4 key={`h-${key++}`} className="mb-1 mt-2 text-[15px] font-bold leading-8 text-ironforge-text">
          {renderInline(h3[1], `h-${key}`)}
        </h4>
      );
      return;
    }

    // numbered 1. 2.
    const num = line.match(/^(\d+)[.)]\s+(.*)/);
    if (num) {
      if (!listBuffer || listBuffer.type !== 'numbered') {
        flushList();
        listBuffer = { type: 'numbered', items: [] };
      }
      listBuffer.items.push(num[2]);
      return;
    }

    // bullet - or * or •
    const bul = line.match(/^[-*•]\s+(.*)/);
    if (bul) {
      if (!listBuffer || listBuffer.type !== 'bullet') {
        flushList();
        listBuffer = { type: 'bullet', items: [] };
      }
      listBuffer.items.push(bul[1]);
      return;
    }

    // >> quick reply hint → styled chip
    const qr = line.match(/^>>\s*(.*)/);
    if (qr) {
      flushList();
      blocks.push(
        <span
          key={`qr-${key++}`}
          className="my-1 inline-block rounded-full border border-ironforge-primary/40 bg-ironforge-primary/10 px-3 py-1 text-[13px] font-bold text-ironforge-primary"
        >
          {qr[1]}
        </span>
      );
      return;
    }

    // normal paragraph
    flushList();
    blocks.push(
      <p key={`p-${key++}`} className="text-[15px] font-normal leading-8 text-ironforge-text">
        {renderInline(raw.trim(), `p-${key}`)}
      </p>
    );
  });

  flushList();

  return <div className="break-words">{blocks}</div>;
}
