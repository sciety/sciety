import * as t from 'io-ts';

const subArticleCodec = t.intersection([
  t.strict({
    'front-stub': t.strict({
      'article-id': t.string,
    }),
  }),
  t.partial({
    body: t.string,
  }),
]);

export const acmiJatsCodec = t.strict({
  article: t.strict({
    'sub-article': t.readonlyArray(subArticleCodec),
  }),
}, 'acmiJatsCodec');

export type SubArticle = t.TypeOf<typeof subArticleCodec>;
