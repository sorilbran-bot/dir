import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

// How each party's side of a record is verified. Both can be true at once.
//   public_url: the party's own channel (website, own post) where the milestone is published -> "Public documentation exists"
//   confirmed:  date the party confirmed it directly to DIR -> "Directly confirmed"
// Neither -> "Unconfirmed". Older plain-text values ('pending', 'confirmed', ...) are read as empty.
const verification = z.preprocess(
  (v) => (typeof v === 'string' || v == null ? {} : v),
  z.object({
    public_url: z.string().url().optional(),
    public_label: z.string().optional(),
    confirmed: z.coerce.date().optional(),
    confirmed_by: z.string().optional(), // optional name and title, e.g. "Jane Doe, Program Director"
  }),
);

const records = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/records' }),
  schema: z.object({
    record_id: z.string().regex(/^DIR-\d{4}-\d{4}$/, 'Use the format DIR-2026-0001'),
    title: z.string(), // one factual sentence, announcement style
    type: z.enum(['launch', 'cohort', 'funding', 'selected-participation', 'award', 'partnership', 'growth']),
    date: z.coerce.date(), // the date it happened
    published: z.coerce.date(),
    businesses: z.array(reference('businesses')).min(1),
    counterparty: reference('organizations').optional(), // launches may have none
    program: z.string().optional(), // cohort, competition or event name
    round: z.string().optional(), // slug of a round listed on the counterparty's program page, e.g. round-3
    status: z.enum(['both-sides', 'one-side', 'launch-verified']),
    amount: z.string().default('undisclosed'), // funding only, e.g. "$250,000"
    funding_kind: z.enum(['grant', 'investment', 'loan', 'prize']).optional(),
    tier: z.string().optional(), // the program's own name for the level, e.g. seed or scale
    sources: z
      .array(
        z.object({
          side: z.enum(['org', 'founder', 'third-party', 'public-trace']),
          label: z.string(),
          url: z.string().url(),
          archived: z.string().url().optional(),
        }),
      )
      .min(1),
    verification: z
      .object({ founder: verification, counterparty: verification })
      .default({ founder: {}, counterparty: {} }),
    pulled_in_by: z.string().optional(), // earlier records only: the current record that led back to it
    client_record: z.boolean().default(false),
    corrections: z.array(z.object({ date: z.coerce.date(), note: z.string() })).default([]),
    example: z.boolean().default(false),
  }),
});

const businesses = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/businesses' }),
  schema: z.object({
    slug: z.string(),
    name: z.string(),
    website: z.string().url().optional(),
    founders: z
      .array(
        z.object({
          name: z.string(),
          profile_url: z.string().url().optional(),
          profile_consent: z.boolean().default(false), // link shows only with consent
        }),
      )
      .default([]),
    detroit_check: z.enum(['state-registration', 'county-dba', 'city-license', 'program-address-proof']),
    example: z.boolean().default(false),
  }),
});

const organizations = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/organizations' }),
  schema: z.object({
    slug: z.string(),
    name: z.string(),
    kind: z.enum(['funder', 'program', 'event-host', 'government', 'other']),
    website: z.string().url().optional(),
    summary: z.string().optional(), // one or two plain sentences: what it is, who runs it
    run_by: z.array(z.string()).default([]),
    // Programs only: the eligibility rules DIR checked records against, with where and when they were captured.
    criteria: z
      .object({
        source_label: z.string(),
        source_url: z.string().url(),
        archived_url: z.string().url().optional(),
        source_date: z.string().optional(), // date or version printed on the source
        captured: z.coerce.date(), // when DIR saved it
        last_checked: z.coerce.date(), // when DIR last confirmed it is still current
        location_rule: z.string(), // the geographic requirement, in plain words
        location_proof: z.string().optional(), // what applicants had to show
        other: z.array(z.string()).default([]),
        note: z.string().optional(),
      })
      .optional(),
    rounds: z
      .array(
        z.object({
          slug: z.string(), // round-3
          label: z.string(), // Round 3
          opens: z.coerce.date().optional(),
          closes: z.coerce.date().optional(),
          announced: z.coerce.date().optional(),
          awards: z.string().optional(),
          venue: z.string().optional(),
          announcement_url: z.string().url().optional(),
          note: z.string().optional(),
        }),
      )
      .default([]),
    example: z.boolean().default(false),
  }),
});

export const collections = { records, businesses, organizations };
