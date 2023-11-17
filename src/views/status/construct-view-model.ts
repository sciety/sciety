import { Json } from 'fp-ts/Json';
import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { Queries } from '../../read-models/index.js';

export const constructViewModel = (queries: Queries): Json => ({
  data: {
    annotations: queries.annotationsStatus(),
    evaluations: queries.evaluationsStatus(),
    followings: queries.followingsStatus(),
    groups: {
      total: queries.getAllGroups().length,
    },
    lists: queries.listsStatus(),
    users: queries.usersStatus(),
  },
  sagaWorkQueues: {
    elifeArticleStates: queries.elifeArticleStatus(),
    unlistedArticles: pipe(
      queries.getUnlistedEvaluatedArticles(),
      RA.map((missingArticle) => ({
        articleId: missingArticle.articleId.value,
        listId: missingArticle.listId,
      })),
    ),
  },
});
