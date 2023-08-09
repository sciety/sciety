import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { ArticleCardViewModel } from '../../../../shared-components/article-card';
import { GroupId } from '../../../../types/group-id';
import { Queries } from '../../../../shared-read-models';

export const constructArticleCards = (
  dependencies: Queries,
  groupId: GroupId,
): ReadonlyArray<ArticleCardViewModel> => pipe(
  groupId,
  dependencies.getEvaluatedArticlesListIdForGroup,
  O.chain((listId) => dependencies.lookupList(listId)),
  O.map((list) => list.articleIds),
  O.match(
    () => [],
    (articleIds) => pipe(
      articleIds,
      RA.map((articleId) => articleId),
      // map list ids using shared-components/article-card/construct-article-card-view-model
    ),
  ),
  () => [],
);
