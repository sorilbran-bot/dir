import type { APIRoute } from 'astro';
import { SITE } from '../site.config';
import { loadAll, isoDate } from '../lib/records';

// Public, machine-readable copy of the whole record.
export const GET: APIRoute = async () => {
  const { recs } = await loadAll();
  const body = {
    name: SITE.name,
    publisher: SITE.publisher,
    url: SITE.url,
    record_start: SITE.recordStart,
    note: 'Records dated before record_start are marked earlier_record and are not counted in totals.',
    generated: new Date().toISOString(),
    records: recs.map((r) => ({
      id: r.d.record_id,
      url: new URL(r.url, SITE.url).href,
      title: r.d.title,
      type: r.type,
      date: r.iso,
      published: isoDate(r.d.published),
      earlier_record: r.earlier,
      status: r.d.status,
      businesses: r.businesses.map((b) => ({ name: b.data.name, url: new URL(`/business/${b.id}/`, SITE.url).href })),
      counterparty: r.counterparty ? { name: r.counterparty.data.name, url: new URL(`/org/${r.counterparty.id}/`, SITE.url).href } : null,
      program: r.d.program ?? null,
      amount: r.type === 'funding' ? r.d.amount : null,
      sources: r.d.sources.map((s) => ({ side: s.side, label: s.label, url: s.url, archived: s.archived ?? null })),
      client_record: r.d.client_record,
      corrections: r.d.corrections.map((c) => ({ date: isoDate(c.date), note: c.note })),
    })),
  };
  return new Response(JSON.stringify(body, null, 2), { headers: { 'Content-Type': 'application/json' } });
};
