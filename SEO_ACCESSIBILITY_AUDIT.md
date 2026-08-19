# SEO and image-alt audit

Audited: 11 August 2026. Updated: 18 August 2026. Scope: Astro routes, shared metadata layout, 22 published project entries, six draft project entries and rendered image components.

## Validation results

- [x] Production build passes: `npm run build` completed successfully on 18 August 2026 and generated 161 static pages.
- [x] The previous `/tags/design` route-collision warning is resolved; the current production build emits no route-collision warning.
- [ ] The generated output confirms 28 project URLs: all 22 published projects **and all six drafts** (`case-study`, `omg`, `project-1b`, `project-template`, `switchdin`, and `zenn`).
- [ ] The generated output contains 118 taxonomy pages (77 tag pages and 41 industry pages), including draft-derived `/tags/test-01`, `/tags/zenn`, `/industries/Test`, and `/industries/Industry` routes.
- [x] Core site pages, dynamic taxonomy pages and all 28 project entries now have specific meta titles and descriptions. No project page contains template/generic project metadata. Only the three `noindex` test pages retain `tbc` metadata.
- [x] `MainHead.astro` now emits canonical and robots directives and uses `metaTitle` for the document `<title>`. The current build contains canonical links on 159 pages and robots directives on 160 pages; the two legacy `/other/project-*` pages remain outside `BaseLayout` and need separate review or removal.
- [x] Every rendered `<img>` has an `alt` attribute.
- [ ] The generated HTML still contains four literal `alt="placeholder"` values, 35 generic numbered image alts and 125 occurrences of generic `cover image` text (repeated wherever affected project cards appear). It also contains 44 occurrences of the unrelated `The full Astro logo.` alt text.

## Release blockers

- [x] The previously blocking bounce-video filename issue is resolved. The videos are now in `public/video/bounce/`, and the production build passes.
- [ ] Exclude drafts from all static route and taxonomy generation. `src/pages/projects/[id].astro`, `src/pages/tags/[tag].astro` and `src/pages/industries/[industry].astro` currently use every collection entry, so the six entries with `state: 'Draft'` are published as URLS and can be indexed.
- [x] The browser title now uses the curated `metaTitle`, with `pageTitle` as its fallback.
- [x] Add a canonical URL and a `robots`/`noindex` prop to `MainHead.astro`. Development pages, tag pages, industry pages and the 404 page should not all inherit indexable defaults.

## Site-page metadata checklist

Metadata implementation completed on 18 August 2026. The values below are the current values rendered in the production build. Visible placeholder body copy remains tracked separately.

| Route | Title | Meta description | Action |
| --- | --- | --- | --- |
| `/` | `Creative Agency for Brand, Digital & Content \| 40ftSlinky` | `40ftSlinky is a boutique creative agency delivering imaginative brand strategy, digital experiences, print and motion solutions.` | Completed. |
| `/about` | `About 40ftSlinky \| Independent Creative Agency` | `Meet 40ftSlinky, a multidisciplinary creative agency creating clear strategies, distinctive identities and practical digital systems.` | Completed. |
| `/contact` | `Contact 40ftSlinky \| Start a Project` | `Talk to 40ftSlinky about your next project. We work with government and businesses across Australia and around the world.` | Completed. |
| `/projects` | `Creative Agency Projects \| 40ftSlinky` | `Explore 40ftSlinky projects across brand identity, strategy, digital, print and motion, created to solve real communication challenges.` | Completed. |
| `/privacy` | `Privacy Policy \| 40ftSlinky` | `Learn how 40ftSlinky handles the personal and sensitive information you share with us.` | Metadata completed; visible policy content remains outstanding. |
| `/terms` | `Website Terms of Use \| 40ftSlinky` | `Read the terms that govern your use of the 40ftSlinky website and its content.` | Metadata completed; visible Lorem Ipsum remains outstanding. |
| `/404` | `Page Not Found \| 40ftSlinky` | `The page you requested could not be found. Return to the 40ftSlinky homepage or explore our creative projects.` | Completed; page is `noindex`. |
| `/tags` and `/industries` | `Project Tags \| 40ftSlinky` / `Industries We Work In \| 40ftSlinky` | `Browse 40ftSlinky creative projects by capability, service and topic.` / `Browse 40ftSlinky creative projects by client industry and sector.` | Completed; pages are `noindex,follow`. |
| `/tags/[tag]` | `${currentTag} Projects \| 40ftSlinky` | `Explore 40ftSlinky creative projects tagged ${currentTag}.` | Metadata completed; draft filtering remains outstanding. |
| `/industries/[industry]` | `${industry} Projects \| 40ftSlinky` | `Explore 40ftSlinky creative projects for clients in ${industry}.` | Metadata completed; draft filtering remains outstanding. |
| `/blog`, `/test`, `/test_insta`, `/test_map` | — | — | Remove from the production build or mark `noindex`; they contain learning/test content or `tbc` metadata. |

## Published-project metadata checklist

Meta titles and descriptions were applied to all 22 published projects on 18 August 2026. The table now records the current metadata. Cover-alt recommendations remain outstanding because the cover alt is also used by project cards and must describe the image rather than saying “cover image”, “The full Astro logo”, or “placeholder”.

| Project | Current title | Current description | Suggested cover alt |
| --- | --- | --- | --- |
| Addi Road | `Addi Road Brand and Print Design \| 40ftSlinky` | `Brand update and printed materials for Addi Road, a vibrant Sydney hub for community engagement.` | `Addi Road community-hub brand materials` |
| Annual Reports | `Annual Report Design & Production \| 40ftSlinky` | `Annual report design, typesetting and print production for government, education, finance and not-for-profit organisations.` | `Selection of annual reports designed by 40ftSlinky` |
| Bruce Energy | `Bruce Energy Brand Identity & Website \| 40ftSlinky` | `A new brand identity and digital presence for Bruce Energy, created to support a new beginning.` | `Bruce Energy brand identity artwork` |
| Cabcharge | `Cabcharge Digital Experience & Campaign \| 40ftSlinky` | `Campaign landing page, user experience and savings calculator designed to help Cabcharge customers understand the value of switching.` | `Cabcharge savings-calculator landing page` |
| Central Park | `Central Park Property Marketing & Digital \| 40ftSlinky` | `Sales materials, digital marketing and a campaign website for Central Park, a luxury property development in Box Hill.` | `Central Park Box Hill property marketing campaign` |
| DiDi Rideshare | `DiDi Rideshare Australia Launch Campaign \| 40ftSlinky` | `Out-of-home, social and digital creative for DiDi Rideshare’s successful Australian launch campaign.` | `DiDi Rideshare campaign at Flinders Street Station` |
| Digital Projects | `Digital Campaigns, Websites & Automation \| 40ftSlinky` | `A selection of digital campaigns, landing pages, HTML5 ads, CRM automation and social creative developed by 40ftSlinky.` | `Digital campaign interfaces and social creative` |
| Hidden Southern Highlands | `Hidden Southern Highlands Interactive Map \| 40ftSlinky` | `An interactive explorer’s map, treasure hunt and immersive audio app that brings the Hidden Southern Highlands to life.` | `Illustrated Hidden Southern Highlands explorer's map` |
| Lug+Carrie | `Lug+Carrie eBike Brand & Digital Platform \| 40ftSlinky` | `A refreshed brand, custom eBike builder and Salesforce-integrated website for Lug+Carrie’s national subscription service.` | `Lug+Carrie eBike subscription website and configurator` |
| Matthew Reilly | `Matthew Reilly Book Cover Design \| 40ftSlinky` | `Twenty-five years of book cover design for bestselling Australian author Matthew Reilly.` | `Collection of Matthew Reilly book covers` |
| National Film and Sound Archive | `NFSA Annual Report & Collateral Design \| 40ftSlinky` | `Annual reports and in-house marketing collateral for the National Film and Sound Archive of Australia.` | `National Film and Sound Archive annual-report design` |
| Polbank / Police Bank | `Police Bank Annual Report Design \| 40ftSlinky` | `Annual report design and production for Police Bank.` | `Police Bank annual report design` |
| Positive Good | `Positive Good Brand Identity & Website \| 40ftSlinky` | `A bold brand refresh, collateral and website for Positive Good, a purpose-driven cleantech marketing agency.` | `Positive Good brand identity artwork` |
| Praemium | `Praemium Brand & Investment Platform Design \| 40ftSlinky` | `Brand, website and digital campaign work that positioned Praemium as a purpose-built investment platform.` | `Praemium investment platform campaign artwork` |
| Protect Our Winters | `Protect Our Winters Election Campaign \| 40ftSlinky` | `Election campaign digital assets and out-of-home creative for climate advocacy organisation Protect Our Winters.` | `Protect Our Winters election campaign poster` |
| Trade Publishing Book Cover Design | `Trade Publishing Book Cover Design \| 40ftSlinky` | `Award-winning book cover design for trade publishers, spanning fiction, non-fiction and reference titles.` | `Trade publishing book cover collection` |
| Royal Melbourne Show | `Royal Melbourne Show Brand & Event Campaign \| 40ftSlinky` | `Brand updates, event point-of-sale and promotional creative for the Royal Melbourne Show.` | `Royal Melbourne Show campaign artwork` |
| Samsung | `Samsung Defence & Agentic Creative \| 40ftSlinky` | `Digital experiences, conference collateral and agentic creative for Samsung’s defence and public-safety technology.` | `Samsung defence and public-safety campaign creative` |
| Sonnen | `Sonnen Australian Brand Launch Campaign \| 40ftSlinky` | `Digital, social and video creative that introduced Sonnen’s home energy-storage solutions to the Australian market.` | `Sonnen home energy campaign creative` |
| SunSolve | `SunSolve Brand & Digital Campaign \| 40ftSlinky` | `Brand and digital campaign work for SunSolve, a physics-driven solar energy modelling and analytics platform.` | `SunSolve brand campaign artwork` |
| University of Canberra | `University of Canberra Marketing & Design \| 40ftSlinky` | `Annual reports, student recruitment and marketing collateral designed and produced for the University of Canberra.` | `University of Canberra annual-report and marketing design` |
| Victoria University | `Victoria University Course Guide Design \| 40ftSlinky` | `Student prospectus and promotional material design for Victoria University’s higher education and TAFE programs.` | `Victoria University course-guide design` |

All six draft entries also now have restrained, content-supported metadata: `case-study`, `omg`, `project-1b`, `project-template`, `switchdin` and `zenn`. They must still be excluded from production route and taxonomy generation.

## Image-alt checklist

- [ ] Replace the four visible `alt="placeholder"` values in `src/components/Bio.astro`: Barry Scott, Ross Tesoriero and Andrew Weibusch should use `Portrait of [name], [role]`. Jeremy should be `Portrait of Jeremy Nicholson, Creative Founder` rather than `40ftSlinky`; Bridget and Gareth should use the same pattern.
- [ ] Replace every generic `coverAlt` in the project frontmatter with the cover-alt column above. The current values `The full Astro logo.`, `cover image`, and `placeholder` are not descriptive.
- [ ] Replace generic numbered gallery alt text on these public project pages. Use the actual asset/section context:
  - `bruce-energy.mdx`: the gallery is unrelated template artwork (`Editorial-Mockup` and colour swatches). Replace it with Bruce Energy work or remove the carousel; do not merely rename `Image 01–03`.
  - `cabcharge.mdx`: `Cabcharge landing-page screen showing savings calculator` and `Cabcharge campaign landing-page interface`.
  - `central-park.mdx`: `Central Park property campaign [cover/interior spread/marketing artwork]`; also correct the duplicate `image04` import, which currently points to the same file as `image03`.
  - `lug-carrie.mdx`: `Lug+Carrie eBike subscription website` and `Lug+Carrie custom bike configurator interface`.
  - `nfsa.mdx`: `National Film and Sound Archive annual report [cover/interior spread/feature spread]`.
  - `polbank.mdx`: `Police Bank Annual Report 2019 [cover/interior spread/feature spread]`.
  - `vicuni.mdx`: `Victoria University Course Guide 2021 [cover/interior spread/feature spread]`. The Annual Reports page currently calls these an annual report; correct that mismatch too.
  - `samsung.mdx`: `Samsung RFSA conference firefighter creative`, `Samsung RFSA exhibition graphic`, and `Samsung RFSA conference collateral`. Replace numbered Agentic Creative alts with a short description of what each visual shows; if each is a variation of the same creative, use `Samsung agentic public-safety campaign creative, variation [n]`.
- [ ] Correct the mislabelled `Ten Ordinary Men` assets in both `addi-road.mdx` and `annual-reports.mdx`: the three alts currently say `The Hollow Tree`; use `Ten Ordinary Men [cover/interior spread/alternate spread]`.
- [ ] Make repeated alts distinct where the image communicates different content: Positive Good business cards, Praemium OOH executions, University of Canberra annual-report/brand-guideline spreads and the Sonnen Facebook grid.
- [ ] Keep already descriptive gallery alts in the Annual Reports, Matthew Reilly, Publishing, Protect Our Winters and Hidden Southern Highlands case studies; only correct factual copy such as `Bowral` if required by the artwork/location.

## Content placeholders that affect index quality

- [ ] Replace or unpublish the thin case-study body copy in Cabcharge, Polbank, NFSA, Victoria University, SunSolve and the draft entries. For example, `Polbank project content.` and `SunSolve project content.` are indexed page descriptions even if metadata is fixed.
- [ ] Replace `Post Title` in the `head` frontmatter for Annual Reports, Positive Good, Praemium and Trade Publishing Book Cover Design. It is not currently rendered as the HTML title, but it is a content-quality warning.
- [ ] Ensure the homepage filters to `state === 'Published'`; it currently sorts and shows every project, including drafts.

## Site and project UX tasks

- [ ] Randomise the four projects shown in the homepage projects grid on each page load. Select four eligible published projects for every request/render, with no draft or test entries included.
- [ ] Add a horizontal three-card `Other projects` grid to the bottom of every project page, immediately before the `GlobalCTA`. Exclude the current project, use published projects only, and provide meaningful links and image alts.

## Verification after implementation

- [x] Run `npm run build` successfully after the metadata implementation (161 pages built on 18 August 2026).
- [ ] Confirm each page has one meaningful `<title>`, one non-empty meta description, canonical URL, and intended index/noindex directive.
- [ ] View the project cards and case-study galleries with a screen reader or accessibility inspector; confirm every informative image has an accurate, non-repetitive alt and decorative images use `alt=""`.
- [ ] Inspect the generated `/projects/*`, `/tags/*` and `/industries/*` output to confirm no draft/test URLs are emitted.
