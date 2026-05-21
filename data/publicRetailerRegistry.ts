import type { PerformanceTrajectory } from "@/types/company-profile";

/** Public retailer records for peer resolution and comparison — enrichment only. */
export type PublicRetailerRecord = {
  ticker: string;
  companyName: string;
  aliases: string[];
  publicCompany: boolean;
  trajectory: PerformanceTrajectory;
};

const T = (
  revenueGrowthPct: number,
  ebitdaGrowthPct: number,
  grossMarginChangeBps: number,
  operatingMarginChangeBps: number,
  ebitdaMarginChangeBps: number,
): PerformanceTrajectory => ({
  revenueGrowthPct,
  ebitdaGrowthPct,
  grossMarginChangeBps,
  operatingMarginChangeBps,
  ebitdaMarginChangeBps,
});

export const PUBLIC_RETAILER_REGISTRY: PublicRetailerRecord[] = [
  {
    ticker: "WMT",
    companyName: "Walmart Inc.",
    aliases: ["walmart", "wal-mart", "wal mart"],
    publicCompany: true,
    trajectory: T(4.1, 2.5, -10, -5, 0),
  },
  {
    ticker: "TGT",
    companyName: "Target Corporation",
    aliases: ["target"],
    publicCompany: true,
    trajectory: T(3.2, 1.8, 40, 15, 20),
  },
  {
    ticker: "COST",
    companyName: "Costco Wholesale Corporation",
    aliases: ["costco", "costco wholesale"],
    publicCompany: true,
    trajectory: T(5.8, 8.2, 5, 0, 10),
  },
  {
    ticker: "KR",
    companyName: "The Kroger Co.",
    aliases: ["kroger", "the kroger co"],
    publicCompany: true,
    trajectory: T(1.2, -2.1, -15, -20, -25),
  },
  {
    ticker: "BBY",
    companyName: "Best Buy Co., Inc.",
    aliases: ["best buy", "bestbuy"],
    publicCompany: true,
    trajectory: T(-2.4, -5.1, -30, -45, -35),
  },
  {
    ticker: "AMZN",
    companyName: "Amazon.com, Inc.",
    aliases: ["amazon", "amazon.com", "amazon inc"],
    publicCompany: true,
    trajectory: T(11.0, 18.5, 35, 25, 30),
  },
  {
    ticker: "DG",
    companyName: "Dollar General Corporation",
    aliases: ["dollar general", "dollar general corp"],
    publicCompany: true,
    trajectory: T(2.8, -1.5, -25, -35, -30),
  },
  {
    ticker: "DLTR",
    companyName: "Dollar Tree, Inc.",
    aliases: ["dollar tree", "family dollar", "dollar tree inc"],
    publicCompany: true,
    trajectory: T(4.5, 3.2, -15, -20, -18),
  },
  {
    ticker: "HD",
    companyName: "The Home Depot, Inc.",
    aliases: ["home depot", "the home depot"],
    publicCompany: true,
    trajectory: T(1.5, 2.0, 10, 5, 8),
  },
  {
    ticker: "LOW",
    companyName: "Lowe's Companies, Inc.",
    aliases: ["lowes", "lowe's", "lowes companies"],
    publicCompany: true,
    trajectory: T(0.8, 1.2, 5, 0, 5),
  },
  {
    ticker: "M",
    companyName: "Macy's, Inc.",
    aliases: ["macys", "macy's", "macys inc"],
    publicCompany: true,
    trajectory: T(-1.8, -4.2, -20, -30, -28),
  },
  {
    ticker: "JWN",
    companyName: "Nordstrom, Inc.",
    aliases: ["nordstrom", "nordstrom inc"],
    publicCompany: true,
    trajectory: T(-3.5, -6.0, -40, -55, -50),
  },
  {
    ticker: "CVS",
    companyName: "CVS Health Corporation",
    aliases: ["cvs", "cvs health", "cvs pharmacy"],
    publicCompany: true,
    trajectory: T(3.0, 2.2, 15, 10, 12),
  },
  {
    ticker: "WBA",
    companyName: "Walgreens Boots Alliance, Inc.",
    aliases: ["walgreens", "walgreens boots alliance", "boots alliance"],
    publicCompany: true,
    trajectory: T(-2.0, -5.5, -35, -50, -45),
  },
  {
    ticker: "TJX",
    companyName: "The TJX Companies, Inc.",
    aliases: ["tjx", "tj maxx", "marshalls", "tjx companies"],
    publicCompany: true,
    trajectory: T(6.2, 7.5, 20, 15, 18),
  },
  {
    ticker: "ROST",
    companyName: "Ross Stores, Inc.",
    aliases: ["ross", "ross stores", "ross dress for less"],
    publicCompany: true,
    trajectory: T(5.5, 6.8, 25, 18, 22),
  },
  {
    ticker: "BJ",
    companyName: "BJ's Wholesale Club Holdings, Inc.",
    aliases: ["bjs", "bj's", "bjs wholesale"],
    publicCompany: true,
    trajectory: T(4.0, 5.5, 10, 8, 12),
  },
];

export const PUBLIC_RETAILER_BY_TICKER: Record<string, PublicRetailerRecord> =
  Object.fromEntries(
    PUBLIC_RETAILER_REGISTRY.map((r) => [r.ticker, r]),
  );
