import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { DateFromISOString } from 'io-ts-types/DateFromISOString';
import { NumberFromString } from 'io-ts-types/NumberFromString';

const serverCodec = t.union([t.literal('biorxiv'), t.literal('medrxiv')]);

const serverFromCaseInsensitiveString = new t.Type<t.TypeOf<typeof serverCodec>, string, unknown>(
  'ServerFromCaseInsensitiveString',
  serverCodec.is,
  (input, context) => pipe(
    t.string.validate(input, context),
    E.chain((value) => {
      const lowercased = value.toLowerCase();
      return serverCodec.is(lowercased) ? t.success(lowercased) : t.failure(input, context);
    }),
  ),
  t.identity,
);

const biorxivArticleVersion = t.type({
  date: DateFromISOString,
  version: NumberFromString,
  category: t.string,
  server: serverFromCaseInsensitiveString,
});

export const responseWithVersions = t.type({
  collection: tt.readonlyNonEmptyArray(biorxivArticleVersion),
});

export type ResponseWithVersions = t.TypeOf<typeof responseWithVersions>;

const responseNoVersionsFound = t.type({
  messages: t.readonlyArray(t.type({
    status: t.literal('no posts found'),
  })),
});

export const biorxivDetailsApiResponse = t.union([
  responseWithVersions,
  responseNoVersionsFound,
], 'biorxivDetailsApiResponse');
