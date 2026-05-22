import type { RetailerArchetypeId, PricingPosture } from "@/types/retailer-archetypes";
import type { RetailerFormat } from "@/types/ui";

export type RetailerArchetypeHint = {
  aliases: string[];
  tickers?: string[];
  archetypeId: RetailerArchetypeId;
  pricingPosture: PricingPosture;
  retailerFormat?: RetailerFormat;
};

/** Deterministic retailer identity → archetype / posture (consultant-realistic defaults). */
export const RETAILER_ARCHETYPE_HINTS: RetailerArchetypeHint[] = [
  {
    aliases: ["target"],
    tickers: ["TGT"],
    archetypeId: "mass",
    pricingPosture: "Hybrid",
    retailerFormat: "Mass",
  },
  {
    aliases: ["walmart", "wal-mart", "wal mart"],
    tickers: ["WMT"],
    archetypeId: "mass",
    pricingPosture: "EDLP",
    retailerFormat: "Mass",
  },
  {
    aliases: ["amazon", "amazon.com"],
    tickers: ["AMZN"],
    archetypeId: "mass",
    pricingPosture: "Hybrid",
    retailerFormat: "Mass",
  },
  {
    aliases: ["kroger", "the kroger co"],
    tickers: ["KR"],
    archetypeId: "grocery",
    pricingPosture: "HiLo",
    retailerFormat: "Grocery",
  },
  {
    aliases: ["publix", "aldi", "heb", "h-e-b"],
    archetypeId: "grocery",
    pricingPosture: "HiLo",
    retailerFormat: "Grocery",
  },
  {
    aliases: ["whole foods", "whole foods market"],
    archetypeId: "premium_grocery",
    pricingPosture: "Premium",
    retailerFormat: "Grocery",
  },
  {
    aliases: ["trader joe's", "trader joes"],
    archetypeId: "premium_grocery",
    pricingPosture: "Value",
    retailerFormat: "Grocery",
  },
  {
    aliases: ["costco", "costco wholesale", "sam's", "sams club", "bj's", "bjs wholesale"],
    tickers: ["COST", "BJ"],
    archetypeId: "club",
    pricingPosture: "EDLP",
    retailerFormat: "Club",
  },
  {
    aliases: ["sephora", "ulta"],
    archetypeId: "specialty",
    pricingPosture: "Specialty",
    retailerFormat: "Specialty",
  },
  {
    aliases: ["best buy", "bestbuy"],
    tickers: ["BBY"],
    archetypeId: "specialty",
    pricingPosture: "HiLo",
    retailerFormat: "Specialty",
  },
  {
    aliases: ["dollar general", "dollar tree", "family dollar"],
    tickers: ["DG", "DLTR"],
    archetypeId: "discount",
    pricingPosture: "EDLP",
    retailerFormat: "Drug",
  },
  {
    aliases: ["cvs", "cvs health", "walgreens", "walgreens boots alliance"],
    tickers: ["CVS", "WBA"],
    archetypeId: "convenience",
    pricingPosture: "Convenience",
    retailerFormat: "Convenience",
  },
  {
    aliases: ["gap", "old navy", "banana republic"],
    archetypeId: "apparel_softlines",
    pricingPosture: "HiLo",
    retailerFormat: "Specialty",
  },
  {
    aliases: ["home depot", "the home depot", "lowes", "lowe's"],
    tickers: ["HD", "LOW"],
    archetypeId: "specialty",
    pricingPosture: "HiLo",
    retailerFormat: "Specialty",
  },
];
