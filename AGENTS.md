# Public site working agreements

- Keep only public documentation, schemas, sanitized catalogs, checksums, and approved assets.
- Never add credentials, private paths, restricted PHANGS data, bulk payloads, or unpublished notes.
- Mark prototype catalogs as synthetic. Bulk releases live on read-only Globus paths.
- Validate the catalog, Astro types, and production build before committing.
- Do not push unless explicitly requested.

## Release curation

- Release curation is recorded in `curation/`; read `curation/README.md` first, then
  `checklist.md` for the next step.
- Private storage locations and commands are in the git-ignored `curation/local/paths.md`.
  Use them for work, but never copy a path from there into a tracked file.
- Keep `catalog/releases.json`, `curation/release-spec.md`, and the LIT paper appendix
  consistent when a product, size, or licence changes.
- `catalog/<release>/inventory.json` and `checksums/` are generated from the staged
  release; regenerate them rather than editing by hand.
