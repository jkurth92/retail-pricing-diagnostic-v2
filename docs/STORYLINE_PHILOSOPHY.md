# Storyline Philosophy

## Architecture-first sequencing

The executive storyline follows a fixed hierarchy defined in `data/executiveStorylineFlow.ts`:

1. Retailer pricing profile  
2. Architecture coherence  
3. KVI / role alignment  
4. Promo / markdown structure  
5. Governance / maturity  
6. Opportunity framing  
7. Strategic implications  

Architecture and premiumization themes appear **before** promotional or lifecycle themes because structural tier and role clarity usually explain whether downstream levers can monetize effectively.

## Theme synthesis

Themes from Step 6B are **grouped hypotheses** with overlap-adjusted margin bands. Step 7 does not re-rank themes; it **places** them into storyline sections by `themeFamily` and suppresses empty sections (except profile, opportunity, and implications).

## Coherence over metric volume

Section narratives concatenate theme summaries in consulting language. Metrics appear as **bounded ranges** attached to themes, not as dense KPI grids. Repeated percentages across sections are avoided — opportunity consolidation lives in the opportunity section.

## Noise suppression

Sections with no qualifying themes are omitted. Low-confidence themes should already be demoted to secondary in Step 6B; Step 7 does not surface disconnected one-off signals as standalone storyline sections.

## Relationship to Step 6B

`data/storylineTemplates.ts` (6B) drives hypothesis grouping and overlap math. Step 7 adds **deliverable packaging** and **section-based narrative flow** without changing underlying theme rankings.

## Future export

`lib/exportScaffold.ts` maps each `StorylineSection` to an `ExportSectionBlock` so memo and deck generators can render the same sequence without re-deriving structure.
