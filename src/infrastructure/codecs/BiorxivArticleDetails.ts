import * as t from 'io-ts';
import { DateFromString } from './DateFromString';
import { NumberFromString } from './NumberFromString';

const biorxivArticleVersion = t.type({
  date: DateFromString,
  version: NumberFromString,
});

export type BiorxivArticleVersion = t.TypeOf<typeof biorxivArticleVersion>;

export const BiorxivArticleDetails = t.type({
  collection: t.array(biorxivArticleVersion),
});
