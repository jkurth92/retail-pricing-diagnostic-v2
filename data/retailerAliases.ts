export type RetailerAliasEntry = {
  aliases: string[];
  ticker: string | null;
  publicCompany: boolean;
  retailerType: "public_retailer" | "private_retailer" | "subsidiary_banner";
  bannerPortfolio?: string;
  geography?: string;
  notes?: string;
};

/** Deterministic name → ticker map. No competitor or pricing logic. */
export const RETAILER_ALIAS_ENTRIES: RetailerAliasEntry[] = [
  {
    aliases: ["walmart", "wal-mart", "wal mart"],
    ticker: "WMT",
    publicCompany: true,
    retailerType: "public_retailer",
    bannerPortfolio: "Walmart Supercenter, Sam's Club",
    geography: "United States · international",
  },
  {
    aliases: ["target"],
    ticker: "TGT",
    publicCompany: true,
    retailerType: "public_retailer",
    bannerPortfolio: "Target stores",
    geography: "United States",
  },
  {
    aliases: ["costco", "costco wholesale"],
    ticker: "COST",
    publicCompany: true,
    retailerType: "public_retailer",
    bannerPortfolio: "Costco warehouses",
    geography: "United States · international",
  },
  {
    aliases: ["kroger", "the kroger co"],
    ticker: "KR",
    publicCompany: true,
    retailerType: "public_retailer",
    bannerPortfolio: "Kroger, Ralphs, Fred Meyer, Harris Teeter",
    geography: "United States",
  },
  {
    aliases: ["best buy", "bestbuy"],
    ticker: "BBY",
    publicCompany: true,
    retailerType: "public_retailer",
    geography: "United States · Canada",
  },
  {
    aliases: ["macys", "macy's", "macy"],
    ticker: "M",
    publicCompany: true,
    retailerType: "public_retailer",
  },
  {
    aliases: ["nordstrom"],
    ticker: "JWN",
    publicCompany: true,
    retailerType: "public_retailer",
  },
  {
    aliases: ["cvs", "cvs health"],
    ticker: "CVS",
    publicCompany: true,
    retailerType: "public_retailer",
  },
  {
    aliases: ["walgreens", "walgreens boots alliance"],
    ticker: "WBA",
    publicCompany: true,
    retailerType: "public_retailer",
  },
  {
    aliases: ["tjx", "tj maxx", "marshalls"],
    ticker: "TJX",
    publicCompany: true,
    retailerType: "public_retailer",
  },
  {
    aliases: ["ross", "ross stores"],
    ticker: "ROST",
    publicCompany: true,
    retailerType: "public_retailer",
  },
  {
    aliases: ["bjs", "bj's wholesale", "bjs wholesale club"],
    ticker: "BJ",
    publicCompany: true,
    retailerType: "public_retailer",
  },
  {
    aliases: ["dollar general"],
    ticker: "DG",
    publicCompany: true,
    retailerType: "public_retailer",
  },
  {
    aliases: ["dollar tree", "family dollar"],
    ticker: "DLTR",
    publicCompany: true,
    retailerType: "public_retailer",
  },
  {
    aliases: ["home depot", "the home depot"],
    ticker: "HD",
    publicCompany: true,
    retailerType: "public_retailer",
  },
  {
    aliases: ["lowes", "lowe's"],
    ticker: "LOW",
    publicCompany: true,
    retailerType: "public_retailer",
  },
  {
    aliases: ["amazon", "amazon.com"],
    ticker: "AMZN",
    publicCompany: true,
    retailerType: "public_retailer",
    notes: "E-commerce and marketplace context — not a traditional store-only grocer.",
  },
  {
    aliases: ["whole foods", "whole foods market"],
    ticker: null,
    publicCompany: false,
    retailerType: "subsidiary_banner",
    bannerPortfolio: "Whole Foods Market (Amazon subsidiary)",
    notes: "Operates as a banner within Amazon — use Amazon parent context only when relevant.",
  },
  {
    aliases: ["trader joe's", "trader joes"],
    ticker: null,
    publicCompany: false,
    retailerType: "private_retailer",
    geography: "United States",
    notes: "Private retailer — manual context only.",
  },
  {
    aliases: ["aldi"],
    ticker: null,
    publicCompany: false,
    retailerType: "private_retailer",
    geography: "United States · Europe",
    notes: "Private international grocer — manual context only.",
  },
  {
    aliases: ["publix"],
    ticker: null,
    publicCompany: false,
    retailerType: "private_retailer",
    geography: "Southeast United States",
  },
  {
    aliases: ["heb", "h-e-b"],
    ticker: null,
    publicCompany: false,
    retailerType: "private_retailer",
    geography: "Texas · Mexico",
  },
];
