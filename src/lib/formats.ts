// Plain-language labels for what an organization runs. Kept apart from who runs it.
export const FORMAT: Record<string, string> = {
  'grant-round': 'Grant round',
  'pitch-competition': 'Pitch competition',
  'program-cohort': 'Program cohort',
  challenge: 'Challenge',
};
export const KIND: Record<string, string> = {
  funder: 'Funder',
  initiative: 'Initiative',
  program: 'Program',
  'event-host': 'Event host',
  government: 'Government',
  'economic-development': 'Economic development organization',
  'support-org': 'Entrepreneur support organization',
  university: 'University',
  company: 'Company',
  other: 'Organization',
};
// How a connected organization relates to this one, read from each side.
export const ROLE_TO: Record<string, string> = { runs: 'Run by', funds: 'Funded by', partner: 'Partners', affiliate: 'Affiliated with' };
export const ROLE_FROM: Record<string, string> = { runs: 'Runs', funds: 'Funds', partner: 'Partner in', affiliate: 'Affiliated with' };
export const ROLE_ORDER = ['runs', 'funds', 'partner', 'affiliate'];
