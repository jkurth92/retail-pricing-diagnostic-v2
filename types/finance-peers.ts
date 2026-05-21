export type FinancePeerSource = "suggested" | "user_added";

/** Benchmarking-only peer — not used in diagnostic engines. */
export type FinancePeer = {
  id: string;
  name: string;
  ticker: string | null;
  source: FinancePeerSource;
  included: boolean;
};
