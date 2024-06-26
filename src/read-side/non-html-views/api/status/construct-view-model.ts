import { Json } from 'fp-ts/Json';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DependenciesForViews } from '../../../dependencies-for-views';

export const constructViewModel = (dependencies: DependenciesForViews): Json => ({
  readModels: {
    annotations: dependencies.annotationsStatus(),
    evaluations: dependencies.evaluationsStatus(),
    followings: dependencies.followingsStatus(),
    groups: {
      total: dependencies.getAllGroups().length,
    },
    lists: dependencies.listsStatus(),
    users: dependencies.usersStatus(),
  },
  sagaWorkQueues: {
    unlistedArticles: pipe(
      dependencies.getUnlistedEvaluatedArticles(),
      RA.map((missingArticle) => ({
        articleId: missingArticle.articleId.value,
        listId: missingArticle.listId,
      })),
    ),
  },
});
