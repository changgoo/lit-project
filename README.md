# LIT public data site

Astro skeleton for **LIT: Learning the ISM with TIGRESS**.

This is a design prototype: its four models are synthetic, no Globus collection
is connected, and no release is public.

Intended remote: git@github.com:changgoo/lit-project.git

## Develop

Requires Node.js 24 or newer.

    npm install
    npm run dev
    npm run check
    npm run build

The GitHub Pages base path is /lit-project/. Bulk payloads stay in immutable
Globus release directories; the converter stays in the private LIT repository.

## Release curation

The public curation record for the first release (specification, provenance,
checklist, inventory, and checksums) is in [`curation/`](curation/README.md).
