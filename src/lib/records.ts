import { getCollection, type CollectionEntry } from 'astro:content';
import { SITE, TYPES, STATUS, type RecordType } from '../site.config';

// Fictional example records only build when SHOW_EXAMPLES=1 (previews). Never on the live site.
const SHOW_EXAMPLES = process.env.SHOW_EXAMPLES === '1';
const keep = (e: { data: { example: boolean } }) => SHOW_EXAMPLES || !e.data.example;

export type Biz = CollectionEntry<'businesses'>;
export type Org = CollectionEntry<'organizations'>;

export interface Rec {
  entry: CollectionEntry<'records'>;
  d: CollectionEntry<'records'>['data'];
  slug: string; // dir-2026-0001
  url: string;
  iso: string; // YYYY-MM-DD it happened
  year: number;
  quarter: number;
  earlier: boolean; // before the record start, never counted
  type: RecordType;
  typeLabel: string;
  statusLabel: string;
  statusCls: string;
  businesses: Biz[];
  counterparty?: Org;
}

export const isoDate = (d: Date) => d.toISOString().slice(0, 10);
export const quarterOf = (d: Date) => Math.floor(d.getUTCMonth() / 3) + 1;
export const fmtDate = (d: Date) =>
  d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
export const qLabel = (y: number, q: number) =>
  `Q${q} ${y} (${['Jan–Mar', 'Apr–Jun', 'Jul–Sep', 'Oct–Dec'][q - 1]})`;

let cache: { recs: Rec[]; bizs: Biz[]; orgs: Org[] } | null = null;

export async function loadAll() {
  if (cache) return cache;
  const bizs = (await getCollection('businesses')).filter(keep);
  const orgs = (await getCollection('organizations')).filter(keep);
  const bizById = new Map(bizs.map((b) => [b.id, b]));
  const orgById = new Map(orgs.map((o) => [o.id, o]));
  const recs: Rec[] = (await getCollection('records')).filter(keep).map((entry) => {
    const d = entry.data;
    const slug = d.record_id.toLowerCase();
    const iso = isoDate(d.date);
    return {
      entry,
      d,
      slug,
      url: `/record/${slug}/`,
      iso,
      year: d.date.getUTCFullYear(),
      quarter: quarterOf(d.date),
      earlier: iso < SITE.recordStart,
      type: d.type,
      typeLabel: TYPES[d.type].label,
      statusLabel: STATUS[d.status].label,
      statusCls: STATUS[d.status].cls,
      businesses: d.businesses.map((r) => bizById.get(r.id)).filter(Boolean) as Biz[],
      counterparty: d.counterparty ? orgById.get(d.counterparty.id) : undefined,
    };
  });
  // Date order only. No featured, no ranking.
  recs.sort((a, b) => (a.iso < b.iso ? 1 : a.iso > b.iso ? -1 : b.d.record_id.localeCompare(a.d.record_id)));
  cache = { recs, bizs, orgs };
  return cache;
}

// Records that count: on or after the start date.
export const counted = (recs: Rec[]) => recs.filter((r) => !r.earlier);
