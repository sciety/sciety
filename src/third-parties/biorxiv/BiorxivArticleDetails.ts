import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { DateFromISOString } from 'io-ts-types/DateFromISOString';
import { NumberFromString } from 'io-ts-types/NumberFromString';

const biorxivArticleVersion = t.type({
  date: DateFromISOString,
  version: NumberFromString,
  category: t.string,
  server: t.union([t.literal('biorxiv'), t.literal('medrxiv')]),
});

export type BiorxivArticleVersion = t.TypeOf<typeof biorxivArticleVersion>;

const happyPathCodec = t.type({
  collection: tt.readonlyNonEmptyArray(biorxivArticleVersion),
});

const noVersionsCodec = t.type({
  messages: t.readonlyArray(t.type({
    status: t.literal('no posts found'),
  })),
});

export const biorxivArticleDetails = t.union([
  happyPathCodec,
  noVersionsCodec,
]);

export type BiorxivDetailsApiResponse = t.TypeOf<typeof biorxivArticleDetails>;

export type BiorxivArticleVersions = t.TypeOf<typeof happyPathCodec>;
