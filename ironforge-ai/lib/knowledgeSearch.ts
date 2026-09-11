import { KNOWLEDGE, type KBEntry } from './data/knowledge';

// Normalize Arabic text for matching (alef/hamza/ta-marbuta/ya)
function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[^\u0600-\u06FFa-z0-9\s]/g, ' ');
}

export function searchKnowledge(query: string, topN = 3): KBEntry[] {
  const q = norm(query);
  const scored = KNOWLEDGE.map(e => {
    let score = 0;
    for (const kw of e.keywords) {
      const k = norm(kw);
      if (!k) continue;
      if (q.includes(k)) score += k.length > 4 ? 3 : 2;
    }
    const title = norm(e.title_ar);
    for (const w of q.split(/\s+/)) {
      if (w.length > 2 && title.includes(w)) score += 2;
    }
    return { e, score };
  }).filter(x => x.score > 0);
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topN).map(x => x.e);
}

export function buildKnowledgeContext(query: string, locale: string): string {
  const hits = searchKnowledge(query, 3);
  if (!hits.length) return '';
  const ar = locale === 'ar';
  let ctx = ar
    ? '\n\n=== معلومات موثقة من قاعدة ATLAS (اعتمد عليها حرفياً ولا تخترع أرقاماً) ===\n'
    : '\n\n=== Verified ATLAS knowledge (ground your answer in it, never invent numbers) ===\n';
  for (const h of hits) {
    ctx += `\n📌 ${ar ? h.title_ar : h.title_ar}\n${ar ? h.content_ar : h.content_en}\n`;
    if (h.medical) {
      ctx += ar
        ? '⚠️ إلزامي: أضف في نهاية الرد: "⚠️ معلومات استرشادية وليست تشخيصاً — استشر طبيباً." ولا تشخص حالة المستخدم.\n'
        : '⚠️ Mandatory: end with "Educational info, not a diagnosis — see a doctor." Never diagnose.\n';
    }
  }
  return ctx;
}
