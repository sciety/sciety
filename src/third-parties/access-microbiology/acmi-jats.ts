import * as t from 'io-ts';

export const acmiJatsCodec = t.strict({
  article: t.strict({
    'sub-article': t.readonlyArray(
      t.intersection([
        t.strict({
          'front-stub': t.strict({
            'article-id': t.string,
          }),
        }),
        t.partial({
          body: t.string,
        }),
      ]),
    ),
  }),
}, 'acmiJatsCodec');

export type AcmiJats = t.TypeOf<typeof acmiJatsCodec>;
