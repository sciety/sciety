import * as t from 'io-ts';
import { NumberFromString } from 'io-ts-types/NumberFromString';
import { DateFromString } from './DateFromString';

const biorxivArticleVersion = t.type({
  date: DateFromString,
  version: NumberFromString,
});

export type BiorxivArticleVersion = t.TypeOf<typeof biorxivArticleVersion>;

export const BiorxivArticleDetails = t.type({
  collection: t.array(biorxivArticleVersion),
});
