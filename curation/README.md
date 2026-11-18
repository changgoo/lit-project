# Release curation: tncr-core-v1.0.0

This folder is the working record for curating the first LIT data release: the
40-model core TIGRESS-NCR suite that accompanies Paper I. Start here when
picking up release work in this repository.

| File | Contents |
| --- | --- |
| [`release-spec.md`](release-spec.md) | What each released file holds: layout, naming, variables, units |
| [`provenance.md`](provenance.md) | How the files were made from the simulation outputs, what was excluded, how they were verified |
| [`checklist.md`](checklist.md) | Status and the remaining steps to publication |
| [`../catalog/releases.json`](../catalog/releases.json) | Release record shown on the site (summary, product table, licences) |
| [`../catalog/tncr-core-v1.0.0/inventory.json`](../catalog/tncr-core-v1.0.0/inventory.json) | Measured file counts and bytes per model and product |
| [`../catalog/tncr-core-v1.0.0/checksums/`](../catalog/tncr-core-v1.0.0/checksums/) | SHA-256 of every released file, one list per model, paths relative to the model folder |

`local/` is git-ignored. It holds the private storage locations and commands
(`local/paths.md`) so they never enter the public history.

## Status (2026-11-18)

- All 40 models are converted and verified: 117,840 files, 1.35 TB.
- The staged release is being copied to Princeton TigerData by the author.
- Licences are set: CC BY 4.0 for the data, BSD-3-Clause for code.
- The Globus collection and the DOI are not yet decided.

## Division of work

The converter and the suite cleanup tooling live in the private LIT repository
(`learn-ism-release-convert`, commits `b1867a1` and `771a96b`); the paper's
data-release appendix is `papers/suite/sections/appendix_data_release.tex`
there. This repository owns the public description of the release: the site,
the catalog, the inventory, and the checksums. Keep the two consistent: when a
product or size changes, update the appendix, `catalog/releases.json`, and
`release-spec.md` together.
