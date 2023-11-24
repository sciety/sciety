/* eslint-disable @typescript-eslint/no-unused-vars */
import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import { ArticleId } from '../../types/article-id';
import { ReadModelEntry, hardcodedReadModel } from './hardcoded-read-model';

type FindAllVersionsForArticleId = (
  articleId: ArticleId,
) => O.Option<RNEA.ReadonlyNonEmptyArray<ReadModelEntry>>;

export const findAllVersionsForArticleId = (
  readModel: ReadModel,
): FindAllVersionsForArticleId => () => pipe(
  hardcodedReadModel.get('uuid:30374f3c-92dc-4692-aac0-ed95883b9ea0'),
  O.fromNullable,
);
