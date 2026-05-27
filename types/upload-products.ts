/** Parsed product row from a client price upload (observational only). */
export type UploadProductRow = {
  productName: string;
  regularPrice: number | null;
  promoPrice: number | null;
};
