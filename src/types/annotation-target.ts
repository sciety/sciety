import * as Eq from 'fp-ts/Eq';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { DoiFromString } from './codecs/DoiFromString';
import { listIdCodec, eqListId } from './list-id';
import { eqArticleId } from './article-id';

export const annotationTargetCodec = t.type({
  articleId: DoiFromString,
  listId: listIdCodec,
});

type AnnotationTarget = t.TypeOf<typeof annotationTargetCodec>;

export const eqAnnotationTarget: Eq.Eq<AnnotationTarget> = pipe(
  {
    articleId: eqArticleId,
    listId: eqListId,
  },
  Eq.struct,
);
