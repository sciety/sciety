import * as t from 'io-ts';

export const crossrefWorkCodec = t.strict({
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

export type CrossrefWork = t.TypeOf<typeof crossrefWorkCodec>;
