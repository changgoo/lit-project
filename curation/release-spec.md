# Release specification: tncr-core-v1.0.0

## Suite

- 40 core models `R8_8pc_NCR_row0000` to `R8_8pc_NCR_row0039` (the original
  32-model block plus eight covariance-repair models), all at fixed
  TIGRESS-NCR microphysics.
- Box 1024 × 1024 × 4096 pc on a 128 × 128 × 512 grid (Δx = 8 pc), run to
  t = 700 code units.
- Code units: length pc, velocity km/s, time pc/(km/s) = 0.9778 Myr.
- **File numbers equal output time divided by cadence**, counted from 0 with no
  gaps: 3D snapshot `0050` is t = 500 (cadence 10); 2D output `0500` is t = 500
  (cadence 1).

## Layout of one model folder `<m>/`

| Path | Count | Cadence | Content |
| --- | --- | --- | --- |
| `3d/<m>.3d.NNNN.athdf` + `.xdmf` | 51 + 51 | 10, `0020`–`0070` (t = 200–700) | 3D snapshot |
| `2d/<m>.proj.NNNN.athdf` | 701 | 1, `0000`–`0700` | projections, all five angles |
| `2d/<m>.slice_{x,y,z}.NNNN.athdf` | 3 × 701 | 1 | slices |
| `hst/<m>.hst`, `hst/<m>.whole.hst`, `hst/<m>.phase{1..18}.hst` | 20 | 0.1 | global histories |
| `zprof/<m>.{whole,phase1..14}.zprof.csv.gz` | 15 | 1 | vertical profiles |
| `<m>.sn.csv` | 1 | every event | supernova log |
| `<m>.starpar.h5` | 1 | 1 | star particles |
| `<m>.pdf2d_nP.h5` | 1 | 1 | n–P phase diagrams |
| `conversion_report.json`, `SHA256SUMS` | 2 | | conversion summary, checksums |

2,946 files per model. Measured sizes per model and product are in
`catalog/tncr-core-v1.0.0/inventory.json`; the suite totals are 988 GB of 3D
snapshots, 167 GB of slices, 106 GB of projections, 75 GB of vertical
profiles, 13 GB of histories, and under 3 GB for the tables.

## Gridded files (Athena++ HDF5)

All `.athdf` files follow the stock Athena++ HDF5 layout (`DatasetNames`,
`VariableNames`, `NumVariables`, `MeshBlockSize`, `RootGridSize`, `Time`,
`LogicalLocations`, `Levels`, `x1f`…`x3v`), compressed with gzip + shuffle.
`athena_read.athdf` and yt (`yt.load(..., units_override=...)`) open them
without a custom loader. A units note is stored in the file attributes.

**3D snapshots.** 256 mesh blocks of 32³ cells, one per original output tile;
24 variables:

| Dataset | Variables |
| --- | --- |
| `prim` | `rho` (n_H, cm⁻³), `press`, `vel1`–`vel3` (km/s), `phi` (self-gravity potential), `r0` (metallicity Z), `r1` (SN-ejecta mass fraction) |
| `B` | `Bcc1`–`Bcc3` |
| `user_out_var` | `T`, `heat_rate`, `cool_rate`, `net_cool_rate`, `xi_CR`, `Erad_PH`, `Erad_LW`, `Erad_PE`, `Erad_PE_unatt`, `Erad_LW_diss`, `xHI`, `xH2`, `xe` |

Unit conversions: P/k_B [K cm⁻³] = `press` × 1.4271 m_H (km/s)² / k_B;
B [G] = `Bcc` × (4π × 1.4271 m_H cm⁻³ (km/s)²)^½.

**Projections.** One 128 × 128 mesh block per file, one dataset per
inclination: `theta0` (face-on), `theta15`, `theta30`, `theta45`, `theta60`
(θ from +z, φ = 270°). Each dataset holds 17 maps, named with a `_thN`
suffix: `nH`, `nHI`, `nH2`, `nHI_CNM`, `nHI_WNM`, `ne`, `ne_sq`, `pok`,
`Erad_FUV`, `Erad_PH`, `nH_Vlos`, `nH_Vlos2`, `nHI_Vlos`, `nHI_Vlos2`,
`ne_Blos`, `nH_Bimgx`, `nH_Bimgy`. Every map is a line-of-sight integral
Σ f dl with dl in pc (`nH` → N_H in cm⁻³ pc; `ne_sq` → EM in cm⁻⁶ pc).
No `.xdmf` is written for 2D files.

**Slices.** Standard Athena++ slice layout, one cell thick along the sliced
axis, through the cells centred 4 pc from the box centre. 15 variables:
`prim` = `rho`, `press`, `vel1`–`vel3`, `r0`, `r1`; `B` = `Bcc1`–`Bcc3`;
`user_out_var` = `xHI`, `xH2`, `xe`, `Erad_PE`, `Erad_PH`.

## Tables

- **History (`.hst`).** Stock Athena++ history format, readable by
  `athena_read.hst`. 7,001 rows, the row nearest each multiple of 0.1.
  Column names have spaces replaced by underscores (e.g. `total_E`).
  `<m>.hst` has 78 global columns; `whole` and the 18 phase files have 99.
- **Supernova log (`.sn.csv`).** One row per supernova: `id`, `time`, ages,
  mass, cluster position `x1–x3`, explosion position `x1sn–x3sn` (differs for
  runaways), ambient density, velocity and energy, `runaway`, `parent`,
  `mode`, and injected mass, momentum and energy (`d_*`).
- **Star particles (`.starpar.h5`).** All 701 outputs in one table. Rows
  `offset[i]:offset[i+1]` belong to output `i` at `time[i]`. Columns `id`,
  `flag` (particle role), `n_ostar`, `mass` [M☉], `age`, `mage` [code time],
  `metal_mass_0`–`4` [M☉], `x1`–`x3` [pc], `v1`–`v3` [km/s].
- **Phase diagrams (`.pdf2d_nP.h5`).** 128 × 128 histograms in
  (log P/k, log n_H) per output, as `(time, y, x)` cubes for the weights
  `volume`, `mass`, `nHI`, `nH2`, `ne`, `Pmag`; bin centres and edges in
  `log_nH`, `log_pok` and `*_edges`.
- **Vertical profiles (`.zprof.csv.gz`).** One file per phase (`whole` and
  `phase1`–`14`), each the concatenation of all 701 outputs with a leading
  `time` column; 149 horizontally averaged quantities.
