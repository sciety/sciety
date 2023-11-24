/* eslint-disable @typescript-eslint/no-unused-vars */
import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { pipe } from 'fp-ts/function';
import { ReadModel, ReadModelEntry, hardcodedReadModel } from './handle-event';
import { ArticleId } from '../../types/article-id';

type FindAllVersionsForArticleId = (
  articleId: ArticleId,
) => O.Option<RNEA.ReadonlyNonEmptyArray<ReadModelEntry>>;

export const findAllVersionsForArticleId = (
  readModel: ReadModel,
): FindAllVersionsForArticleId => (articleId) => pipe(
  hardcodedReadModel.get(articleId.value),
  O.fromNullable,
);
