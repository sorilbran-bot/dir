# Detroit Innovation Record

The public site for the Detroit Innovation Record, run by the Detroit Media and Innovation Lab.
Built with Astro, hosted on Cloudflare Pages, edited with Pages CMS.

## Before going live: three settings

Open `src/site.config.ts` and set:
- `contactEmail`: the address people write to for corrections and removals
- `url`: the domain, if it isn't detroitinnovationrecord.com (also change it in `astro.config.mjs`)

## Put it on GitHub

1. On github.com, create a new repository (for example `detroit-innovation-record`). Private is fine.
2. Upload everything in this folder to it. You can drag and drop on the GitHub website, or use GitHub Desktop.

## Connect it to Cloudflare Pages

1. In Cloudflare: **Workers & Pages → Create → Pages → Connect to Git**, then pick the repository.
2. Build settings:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
3. **To click around with the fictional examples first:** under *Environment variables*, add `SHOW_EXAMPLES` = `1`. Deploy. You'll get a free `something.pages.dev` address to try it.
4. **Before anyone else sees it:** delete the `SHOW_EXAMPLES` variable and redeploy. The examples disappear and the home page shows "The first records are being verified now."
5. Connect the domain: **Custom domains → Set up a custom domain → detroitinnovationrecord.com**. If the domain is already in your Cloudflare account, this takes a couple of clicks.

Every change to the repository rebuilds the site in about a minute.

## Publishing records with Pages CMS

1. Go to https://pagescms.org, sign in with GitHub and open this repository.
2. You'll see three sections: **Records**, **Businesses**, **Organizations**. The forms come from `.pages.yml`.
3. Add the business and the organization first (once each), then add the record and pick them from the dropdowns.
4. Save. The site updates about a minute later.

Record IDs run in order: `DIR-2026-0001`, `DIR-2026-0002`, and so on.

## How the rules are built in

- The site works out the year and quarter from the date it happened. Nobody tags periods.
- Anything dated before Nov 1, 2026 is shown as "Earlier record" and left out of every count and time filter. Use "pulled in by" to say which current record led back to it.
- "Last 30 days," "This quarter" and "Last quarter" are calculated in the visitor's browser, so they stay correct without a rebuild.
- Closed periods have permanent addresses you can cite, e.g. `/records/funding/2026/q4/`.
- Funding is counted, never added up.
- Everything is sorted by date. Nothing is featured.
- `/records.json` is a public, machine-readable copy of the whole record.

## Where things live

- `src/site.config.ts` — name, domain, email, start date, type names
- `src/content/records/` — one file per record
- `src/content/businesses/`, `src/content/organizations/` — one file per business or organization
- `src/pages/` — page templates
- `public/styles.css` — the look

## Removing the fictional examples for good

Delete the files marked `example: true` in the three `src/content/` folders (Fernbrook Labs, Northline Robotics, Gratiot Goods, Maple & Grand Coffee, Riverline Seed Fund, Eastside Venture Studio, and DIR-2026-0001 to 0005). Real records should start at `DIR-2026-0001`.
