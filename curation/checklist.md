# Checklist to publication: tncr-core-v1.0.0

## Done

- [x] Release contents decided (Paper I review, 2026-11-12 to 2026-11-17)
- [x] In-place cleanup of the 40 run directories; removed files deleted (2026-11-17)
- [x] Conversion of all 40 models; per-model verification (2026-11-18)
- [x] Inventory and checksums in `catalog/tncr-core-v1.0.0/`
- [x] Licences: CC BY 4.0 (data), BSD-3-Clause (code)

## In progress

- [ ] Copy of the staged release to TigerData (author)

## To do

- [ ] Verify the TigerData copy against `catalog/tncr-core-v1.0.0/checksums/`
      (`sha256sum -c <model>.sha256` from inside each model folder)
- [ ] Set up the Globus collection; record `globus_collection_id`
- [ ] Choose the DOI route (e.g. Princeton Data Commons) and mint the DOI
- [ ] Short loading example (athena_read and yt) under BSD-3-Clause; resolve
      the yt `slice_y` dimensionality report first
- [ ] User-facing `AGENTS.md` and a skill shipped with the release
- [ ] Add a release-level README and LICENSE files to the payload
- [ ] Replace the synthetic model records in `src/data/models.json` with the
      sanitized 40-model catalog
- [ ] Set `status` to `published`, fill `doi`, and update the site copy
