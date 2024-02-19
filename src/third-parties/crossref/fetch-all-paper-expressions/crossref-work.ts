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
  'date-parts': t.readonlyArray(t.union([
    t.tuple([t.number, t.number, t.number]),
    t.tuple([t.number, t.number]),
    t.tuple([t.number]),
  ])),
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

const unsupportedCrossrefWorkCodec = t.strict({
  type: t.literal('component'),
  DOI: t.string,
  relation: relationshipsCodec,
});

const supportedCrossrefWorkCodec = t.union([postedContentCodec, journalArticleCodec]);

export type SupportedCrossrefWork = t.TypeOf<typeof supportedCrossrefWorkCodec>;

export const isSupportedCrossrefWork = (crossrefWork: CrossrefWork): crossrefWork is SupportedCrossrefWork => crossrefWork.type === 'journal-article' || crossrefWork.type === 'posted-content';

type CrossrefWorkPostedContent = t.TypeOf<typeof postedContentCodec>;

export const isCrossrefWorkPostedContent = (supportedCrossrefWork: SupportedCrossrefWork): supportedCrossrefWork is CrossrefWorkPostedContent => supportedCrossrefWork.type === 'posted-content';

export const crossrefWorkCodec = t.union([postedContentCodec, journalArticleCodec, unsupportedCrossrefWorkCodec]);

export type CrossrefWork = t.TypeOf<typeof crossrefWorkCodec>;
