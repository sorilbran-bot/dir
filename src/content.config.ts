import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

const verification = z.enum(['confirmed', 'pending', 'no-reply', 'not-applicable']).default('pending');

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
    status: z.enum(['both-sides', 'one-side', 'launch-verified']),
    amount: z.string().default('undisclosed'), // funding only, e.g. "$250,000"
    funding_kind: z.enum(['grant', 'investment', 'loan', 'prize']).optional(),
    sources: z
      .array(
        z.object({
          side: z.enum(['org', 'founder', 'public-trace']),
          label: z.string(),
          url: z.string().url(),
          archived: z.string().url().optional(),
        }),
      )
      .min(1),
    verification: z
      .object({ founder: verification, counterparty: verification })
      .default({ founder: 'pending', counterparty: 'pending' }),
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
    detroit_check: z.enum(['state-registration', 'county-dba', 'city-license']),
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
    example: z.boolean().default(false),
  }),
});

export const collections = { records, businesses, organizations };
