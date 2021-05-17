import * as O from 'fp-ts/Option';

const hasPrefix = <T>(prefix: string) => (x: unknown): x is T => typeof x === 'string' && x.startsWith(`${prefix}:`);
const fromStringPrefix = <T>(prefix: string) => (x: string): T => `${prefix}:${x}` as unknown as T;

type RapidReviewId = string & { readonly RapidReviewId: unique symbol };
const has = hasPrefix<RapidReviewId>('rapid-review');
const fromString = fromStringPrefix<RapidReviewId>('rapid-review');
const serialize = (rapidReviewId: RapidReviewId): string => rapidReviewId;
const deserialize = O.fromPredicate(has);

// ts-unused-exports:disable-next-line
export {
  RapidReviewId, has, fromString, serialize, deserialize,
};
