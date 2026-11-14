// The few settings SJ may need to change. Everything else reads from here.
export const SITE = {
  name: 'Detroit Innovation Record',
  short: 'DIR',
  url: 'https://detroitinnovationrecord.com', // change if the domain differs
  contactEmail: '[CONTACT EMAIL]', // e.g. record@detroitmediainnovation.com
  publisher: 'Detroit Media and Innovation Lab',
  publisherUrl: 'https://detroitmediainnovation.com',
  founder: 'Sorilbran Stone',
  // Nothing dated before this counts. Earlier records show as "Earlier record".
  recordStart: '2026-11-01',
  description:
    "A free public archive of dated, sourced milestones from Detroit's founder and business ecosystem.",
};

// The three types the pilot leads with get the big tiles on the home page.
export const PILOT_TYPES = ['launch', 'cohort', 'funding'] as const;

export const TYPES = {
  launch: { label: 'Launch', plural: 'Launches', blurb: 'Products, services and locations that went to market' },
  cohort: { label: 'Cohort or program', plural: 'Cohorts and programs', blurb: 'Accepted into an accelerator, cohort or fellowship' },
  funding: { label: 'Funding', plural: 'Funding', blurb: 'Grants, investments, loans and prizes from a named source' },
  'selected-participation': { label: 'Selected participation', plural: 'Selected participation', blurb: 'Chosen to pitch, speak, present or demo' },
  award: { label: 'Award or recognition', plural: 'Awards and recognition', blurb: 'A named honor from a named body' },
  partnership: { label: 'Partnership', plural: 'Partnerships', blurb: 'A formal agreement with a named organization' },
  growth: { label: 'Growth', plural: 'Growth', blurb: 'A contract or expansion with a named counterparty' },
} as const;

export type RecordType = keyof typeof TYPES;
export const TYPE_KEYS = Object.keys(TYPES) as RecordType[];

export const STATUS = {
  'both-sides': { label: 'Both sides documented', cls: 'both' },
  'one-side': { label: 'One side documented', cls: 'one' },
  'launch-verified': { label: 'Launch verified', cls: 'launch' },
} as const;
