// ts-unused-exports:disable-next-line
export type RapidReviewDoi = string & { readonly RapidReviewId: unique symbol };

// ts-unused-exports:disable-next-line
export const fromValidatedString = (value: string): RapidReviewDoi => value as RapidReviewDoi;
