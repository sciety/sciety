export type PaperExpressionLocator = string & { readonly PaperExpressionLocator: unique symbol };

export const fromDoi = (doi: string): PaperExpressionLocator => `doi:${doi}` as PaperExpressionLocator;
