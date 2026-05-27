"use client";

import { useCallback, useMemo, useState } from "react";
import { applyRefinementPresentation } from "@/lib/refinementAdjustments";
import { compileRefinementControls } from "@/lib/refinementInterpreter";
import {
  createInitialRefinementState,
  DEFAULT_REFINEMENT_SLIDERS,
  refinementBadgesFromTrail,
} from "@/lib/refinementState";
import type { RefinementSliderState, RefinementState } from "@/types/refinement";
import type { DiagnosticReadout } from "@/types/diagnostic-readout";
import type { ComputedEvidenceBundle } from "@/types/evidence-computation";
import type { OpportunityExposureBundle } from "@/types/opportunity-exposure";

export type UseDiagnosticRefinementOptions = {
  baseReadout: DiagnosticReadout | null;
  computedEvidence?: ComputedEvidenceBundle | null;
  opportunityExposure?: OpportunityExposureBundle | null;
  evaluatedRevenuePercent?: number | null;
};

export function useDiagnosticRefinement({
  baseReadout,
  computedEvidence,
  opportunityExposure,
  evaluatedRevenuePercent,
}: UseDiagnosticRefinementOptions) {
  const [state, setState] = useState<RefinementState>(createInitialRefinementState);

  const setSliders = useCallback((sliders: RefinementSliderState) => {
    setState((s) => ({ ...s, sliders }));
  }, []);

  const setFeedbackText = useCallback((feedbackText: string) => {
    setState((s) => ({ ...s, feedbackText }));
  }, []);

  const previewRefinement = useCallback(() => {
    const { emphasis, trail } = compileRefinementControls(
      state.sliders,
      state.feedbackText,
    );
    setState((s) => ({
      ...s,
      mode: "preview",
      activeEmphasis: emphasis,
      trail,
    }));
  }, [state.sliders, state.feedbackText]);

  const applyRefinement = useCallback(() => {
    const { emphasis, trail } = compileRefinementControls(
      state.sliders,
      state.feedbackText,
    );
    setState((s) => ({
      ...s,
      mode: "applied",
      activeEmphasis: emphasis,
      appliedEmphasis: emphasis,
      trail,
    }));
  }, [state.sliders, state.feedbackText]);

  const resetRefinement = useCallback(() => {
    setState(createInitialRefinementState());
  }, []);

  const presentation = useMemo(() => {
    if (!baseReadout || state.mode === "base" || !state.activeEmphasis) {
      return null;
    }
    return applyRefinementPresentation(
      {
        readout: baseReadout,
        emphasis: state.activeEmphasis,
        computedEvidence,
        opportunityExposure,
        evaluatedRevenuePercent,
      },
      {
        mode: state.mode,
        badges: refinementBadgesFromTrail(state.trail),
        trail: state.trail,
      },
    );
  }, [
    baseReadout,
    state.mode,
    state.activeEmphasis,
    state.trail,
    computedEvidence,
    opportunityExposure,
    evaluatedRevenuePercent,
  ]);

  const displayReadout = presentation?.readout ?? baseReadout;

  const hasPendingControls = useMemo(() => {
    const slidersChanged =
      state.sliders.opportunityFraming !== DEFAULT_REFINEMENT_SLIDERS.opportunityFraming ||
      state.sliders.architectureEmphasis !== DEFAULT_REFINEMENT_SLIDERS.architectureEmphasis ||
      state.sliders.confidenceAdjustment !== DEFAULT_REFINEMENT_SLIDERS.confidenceAdjustment;
    return slidersChanged || state.feedbackText.trim().length > 0;
  }, [state.sliders, state.feedbackText]);

  return {
    state,
    setSliders,
    setFeedbackText,
    previewRefinement,
    applyRefinement,
    resetRefinement,
    presentation,
    displayReadout,
    hasPendingControls,
    isPreview: state.mode === "preview",
    isApplied: state.mode === "applied",
  };
}
