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

const responseWithVersions = t.type({
  collection: tt.readonlyNonEmptyArray(biorxivArticleVersion),
});

export const isResponseWithVersions = (response: BiorxivDetailsApiResponse): response is ResponseWithVersions => {
  if (!('messages' in response)) { return true; } return false;
};

export type ResponseWithVersions = t.TypeOf<typeof responseWithVersions>;

const responseNoVersionsFound = t.type({
  messages: t.readonlyArray(t.type({
    status: t.literal('no posts found'),
  })),
});

export const biorxivDetailsApiResponse = t.union([
  responseWithVersions,
  responseNoVersionsFound,
]);

type BiorxivDetailsApiResponse = t.TypeOf<typeof biorxivDetailsApiResponse>;
