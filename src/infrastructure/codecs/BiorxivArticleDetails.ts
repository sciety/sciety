import * as t from 'io-ts';
import { DateFromISOString } from 'io-ts-types/DateFromISOString';
import { NumberFromString } from 'io-ts-types/NumberFromString';

const biorxivArticleVersion = t.type({
  date: DateFromISOString,
  version: NumberFromString,
});

export type BiorxivArticleVersion = t.TypeOf<typeof biorxivArticleVersion>;

export const BiorxivArticleDetails = t.type({
  collection: t.array(biorxivArticleVersion),
});
