import * as t from 'io-ts';

export const acmiJatsCodec = t.strict({
  article: t.strict({
    'sub-article': t.readonlyArray(
      t.strict({
        'front-stub': t.strict({
          'article-id': t.string,
        }),
        body: t.unknown,
      }),
    ),
  }),
});

export type AcmiJats = t.TypeOf<typeof acmiJatsCodec>;