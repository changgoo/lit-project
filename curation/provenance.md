# Provenance: tncr-core-v1.0.0

## 1. Source outputs and in-place cleanup (2026-11-12)

The simulations restarted 67 times across the suite. Each restart wrote an
extra output at the restart time, so file numbers drifted away from
time/cadence, and the position-binned histograms broke. The run directories
were cleaned in place so that every file number equals round(t/dt):

- **Restart dumps:** a file whose header time equals a restart time and that
  shares its cadence slot with an on-cadence file was removed (67 per output
  stream; 1,005 vertical-profile files). Restarts that landed on a cadence
  multiple and overwrote in place leave one file per slot and were kept.
- **Renumbering:** all later files in each stream were renumbered; each 3D
  snapshot's 256 tiles were renamed with it.
- **Corrupted histograms:** position-binned pdf2d (x1–x2 after the first
  restart, x1–x3 whole) and the n–T phase diagrams (which intermittently lose
  the z > 0 half) were removed. n–P phase diagrams and projections passed the
  same checks.
- **Stale files:** 4,611 leftover files from an earlier July 2026 run of
  `row0000` were removed.
- Restart files, raw histories, and run inputs were not touched.

Every move was logged per run. The removed files were deleted on
2026-11-17 after the author's approval; the per-run manifests are kept in the
private LIT workspace.

## 2. Conversion (2026-11-17/18)

Converter: `learn-ism-release-convert` in the private LIT repository, commits
`b1867a1` (converter) and `771a96b` (tolerate crash padding in logs). It
reads only the cleaned outputs, never modifies them, and writes
`conversion_report.json` and `SHA256SUMS` per model.

- **3D:** VTK tiles of snapshots t ≥ 200 (every 10) → one `.athdf` with one
  mesh block per tile, plus `.xdmf`.
- **2D:** the five projection angles of one output time → one file;
  even-numbered slice outputs (cadence 0.5 in the source) → x, y, z slice
  files at cadence 1, renumbered to match the projections.
- **History:** append-only logs keep only the final branch after each
  restart (rows at or after the restart time on the abandoned branch are
  dropped), then the row nearest each multiple of 0.1 is kept (largest
  offset ≈ 0.0065).
- **Supernova log:** same branch pruning using the restart times from the run
  logs (`sn_rows_dropped_restart_branches` in the inventory).
- **Star particles, phase diagrams, vertical profiles:** every cadence-1
  output concatenated into one file per product (and per phase for profiles).
- Logs padded with NUL bytes by a crash (`row0033`) are read past the padding.

## 3. Verification

- Every model passes the per-model check: file counts and times for each
  product (`learn-ism-release-convert <run> --out <root> --verify`).
- `row0010` spot checks: a 3D tile (`rho`, `r1`) matches the source
  bit-for-bit, and yt loads the snapshot as 128 × 128 × 512 with matching
  temperature sums; the θ = 45° `ne_sq` projection and the z-slice `xH2` at
  output 650 match exactly; the n–P histogram at output 400 matches; the
  history reads in `athena_read.hst` (7,001 rows); supernova times increase.

## 4. Known issues

- yt reports the `slice_y` files as one-dimensional, although the data load
  correctly. Check before writing the loading example.
- `row0033/conversion_report.json` lists only the 13 history files rewritten
  in the rerun; the other 7 were written correctly in the first pass and are
  present (20 files, 7,001 rows each) and checksummed.

## Excluded from the release

Position-binned pdf2d (face-on x1–x2, edge-on x1–x3), n–T phase diagrams,
power-spectrum caches, LIT-derived products, movie frames, restart files, and
raw run logs.
