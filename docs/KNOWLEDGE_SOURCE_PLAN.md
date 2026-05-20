# Knowledge Source Plan

## Purpose

Define how benchmark concepts from proprietary or client-specific knowledge sources may eventually inform diagnostic rules — without committing raw documents or activating rules prematurely.

## Storage policy

| Location | Contents | Git |
|----------|----------|-----|
| `knowledge/raw/` | Original PDFs, decks, playbooks | **Never commit** |
| `knowledge/extracted/` | Machine-assisted extractions | **Never commit** |
| `knowledge/review/` | Analyst review worksheets | **Never commit** |
| `client_uploads/` | Client pricing files | **Never commit** |
| `data/ruleLibraryPlaceholder.ts` | Disabled rule slots | Commit (scaffold only) |
| Future `knowledge/manifests/` | Approved concept manifests | Commit after review |

## Workflow

1. **Ingest locally** — Raw documents stay on local disk or approved secure storage.
2. **Extract concepts** — Analysts or tools produce candidate concepts (not auto-rules).
3. **Review** — Each concept receives review status: rejected, pending, or approved for alignment.
4. **Align** — Approved concepts are translated into explicit rule definitions with thresholds and formulas signed off separately.
5. **Implement** — Only aligned rules move from `disabled` to active in the rule library.

## What must not happen

- Committing raw proprietary documents to GitHub
- Committing client pricing files or context decks
- Turning extracted concepts into active rules without explicit alignment
- Hardcoding benchmark thresholds or opportunity rates from documents
- Using knowledge sources to auto-generate opportunity values or AI recommendations

## Engine relationship

The diagnostic engine (`lib/diagnostic-engine/`) reads the **disabled** rule library scaffold. `rulesApproved` remains false until alignment is recorded in process — not in code alone.

## Next decision point

Before enabling any rule:

1. Complete upload schema alignment (Step 3 in product roadmap).
2. Complete observed pattern feature alignment.
3. Review and approve a concept manifest (local).
4. Sign off rule thresholds and formulas per lever.
5. Enable rules individually with tests — never bulk-enable from document ingestion.
