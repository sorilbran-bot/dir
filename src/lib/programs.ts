import type { Org } from './records';
import { FORMAT, KIND } from './formats';

// Every competition, cohort and grant round on file, with the text search should match.
export function allRounds(orgs: Org[]) {
  const byId = new Map(orgs.map((o) => [o.id, o]));
  return orgs
    .filter((o) => !o.data.example)
    .flatMap((o) =>
      o.data.rounds.map((rd) => {
        const dates = [rd.opens, rd.closes, rd.finalists_announced, rd.event, rd.announced].filter(Boolean) as Date[];
        const last = dates.length ? new Date(Math.max(...dates.map((d) => d.getTime()))) : undefined;
        const related = o.data.connections.map((k) => byId.get(k.org.id)?.data.name).filter(Boolean);
        return {
          org: o,
          rd,
          url: `/org/${o.id}/${rd.slug}/`,
          last,
          format: rd.format ? FORMAT[rd.format] : undefined,
          search: [rd.label, o.data.name, rd.format && FORMAT[rd.format], ...related, ...rd.participants].filter(Boolean).join(' '),
        };
      }),
    )
    .sort((a, b) => (b.last?.getTime() ?? 0) - (a.last?.getTime() ?? 0));
}

export function orgSearch(o: Org, orgs: Org[]) {
  const byId = new Map(orgs.map((x) => [x.id, x]));
  const related = [
    ...o.data.connections.map((k) => byId.get(k.org.id)?.data.name),
    ...orgs.filter((x) => x.data.connections.some((k) => k.org.id === o.id)).map((x) => x.data.name),
  ];
  return [o.data.name, KIND[o.data.kind], o.data.summary, ...o.data.rounds.map((r) => r.label), ...related].filter(Boolean).join(' ');
}
