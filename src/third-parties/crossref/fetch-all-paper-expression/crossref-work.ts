import * as t from 'io-ts';

const postedContentCodec = t.strict({
  type: t.literal('posted-content'),
  DOI: t.string,
  posted: t.strict({
    'date-parts': t.readonlyArray(t.tuple([t.number, t.number, t.number])),
  }),
  resource: t.strict({
    primary: t.strict({
      URL: t.string,
    }),
  }),
  relation: t.partial({
    'has-version': t.readonlyArray(t.strict({
      'id-type': t.literal('doi'),
      id: t.string,
    })),
    'is-version-of': t.readonlyArray(t.strict({
      'id-type': t.literal('doi'),
      id: t.string,
    })),
  }),
});

const journalArticleCodec = t.strict({
  type: t.literal('journal-article'),
  DOI: t.string,
  published: t.strict({
    'date-parts': t.readonlyArray(t.tuple([t.number, t.number, t.number])),
  }),
  resource: t.strict({
    primary: t.strict({
      URL: t.string,
    }),
  }),
  relation: t.partial({
    'has-version': t.readonlyArray(t.strict({
      'id-type': t.literal('doi'),
      id: t.string,
    })),
    'is-version-of': t.readonlyArray(t.strict({
      'id-type': t.literal('doi'),
      id: t.string,
    })),
  }),
});

export const crossrefWorkCodec = t.union([postedContentCodec, journalArticleCodec], 'type');

export type CrossrefWork = t.TypeOf<typeof crossrefWorkCodec>;

export type CrossrefWorkPostedContent = t.TypeOf<typeof postedContentCodec>;
