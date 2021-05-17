// ts-unused-exports:disable-next-line
export type RapidReviewId = string & { readonly RapidReviewId: unique symbol };

// ts-unused-exports:disable-next-line
export const isRapidReviewId = (x: unknown): x is RapidReviewId => typeof x === 'string' && x.startsWith('rapid-review:');

// ts-unused-exports:disable-next-line
export const fromString = (x: string): RapidReviewId => `rapid-review:${x}` as RapidReviewId;
