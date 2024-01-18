import * as t from 'io-ts';

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

const datePartsCodec = t.strict({
  'date-parts': t.readonlyArray(t.tuple([t.number, t.number, t.number])),
});

const resourceCodec = t.strict({
  primary: t.strict({
    URL: t.string,
  }),
});

const journalArticleCodec = t.strict({
  type: t.literal('journal-article'),
  DOI: t.string,
  published: datePartsCodec,
  resource: resourceCodec,
  relation: relationshipsCodec,
});

const postedContentCodec = t.strict({
  type: t.literal('posted-content'),
  DOI: t.string,
  posted: datePartsCodec,
  resource: resourceCodec,
  relation: relationshipsCodec,
});

type CrossrefWorkPostedContent = t.TypeOf<typeof postedContentCodec>;

export const isCrossrefWorkPostedContent = (crossrefWork: CrossrefWork): crossrefWork is CrossrefWorkPostedContent => crossrefWork.type === 'posted-content';

export const crossrefWorkCodec = t.union([postedContentCodec, journalArticleCodec]);

export type CrossrefWork = t.TypeOf<typeof crossrefWorkCodec>;
