import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as crossrefDate from './date-stamp';

const relationCodec = t.strict({
  'id-type': t.literal('doi'),
  id: t.string,
});

const relationsCodec = t.readonlyArray(relationCodec);

const relationshipsCodec = t.partial({
  'has-version': relationsCodec,
  'is-version-of': relationsCodec,
  'has-preprint': relationsCodec,
  'is-preprint-of': relationsCodec,
});

const resourceCodec = t.strict({
  primary: t.strict({
    URL: t.string,
  }),
});

const journalArticleCodec = t.strict({
  type: t.literal('journal-article'),
  DOI: t.string,
  published: crossrefDate.codec,
  resource: resourceCodec,
  relation: relationshipsCodec,
});

const postedContentCodec = t.strict({
  type: t.literal('posted-content'),
  DOI: t.string,
  posted: crossrefDate.codec,
  resource: resourceCodec,
  relation: relationshipsCodec,
});

type OtherWorkType = 'other';

const isOtherWorkType = (input: unknown): input is OtherWorkType => (
  typeof input === 'string'
  && input !== 'posted-content'
  && input !== 'journal-article'
);

const otherTypeCodec = new t.Type<OtherWorkType, string, unknown>(
  'other Crossref type',
  isOtherWorkType,
  (u, c) => pipe(
    t.string.validate(u, c),
    E.filterOrElseW(isOtherWorkType, () => 'Should be unreachable'),
    E.map(() => 'other'),
    E.fold(
      () => t.failure(u, c),
      (val) => t.success(val as OtherWorkType),
    ),
  ),
  (a) => a.toString(),
);

const otherCrossrefWorkCodec = t.strict({
  type: otherTypeCodec,
  DOI: t.string,
  relation: relationshipsCodec,
});

export const crossrefWorkCodec = t.union([postedContentCodec, journalArticleCodec, otherCrossrefWorkCodec]);

export type CrossrefWork = t.TypeOf<typeof crossrefWorkCodec>;
