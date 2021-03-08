import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { DateFromISOString } from 'io-ts-types/DateFromISOString';
import { NumberFromString } from 'io-ts-types/NumberFromString';

const biorxivArticleVersion = t.type({
  date: DateFromISOString,
  version: NumberFromString,
});

export const biorxivArticleDetails = t.type({
  collection: tt.readonlyNonEmptyArray(biorxivArticleVersion),
});

export type BiorxivArticleDetails = t.TypeOf<typeof biorxivArticleDetails>;
