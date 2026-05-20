# Knowledge sources (local / approved storage only)

This directory is a **placeholder for approved manifests** — not raw proprietary documents.

## Do not commit

- Raw client uploads
- Proprietary consulting source PDFs, decks, or internal playbooks
- Unreviewed extractions from knowledge documents

Paths ignored by Git are defined in the root `.gitignore`:

- `knowledge/raw/`
- `knowledge/extracted/`
- `knowledge/review/`

## Allowed in GitHub (after review)

- Manifest files listing approved concept IDs and review status
- Derived rule definitions that passed explicit alignment
- Documentation references (not document binaries)

See [`docs/KNOWLEDGE_SOURCE_PLAN.md`](../docs/KNOWLEDGE_SOURCE_PLAN.md).
