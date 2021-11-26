import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { ArticleActivity } from '../../types/article-activity';
import { Doi } from '../../types/doi';

export type AllArticleActivityReadModel = Map<string, ArticleActivity>;

export const getActivityForDoi = (
  activities: AllArticleActivityReadModel,
) => (
  doi: Doi,
): ArticleActivity => pipe(
  activities.get(doi.value),
  O.fromNullable,
  O.getOrElseW(() => ({
    doi,
    latestActivityDate: O.none,
    evaluationCount: 0,
  })),
);
