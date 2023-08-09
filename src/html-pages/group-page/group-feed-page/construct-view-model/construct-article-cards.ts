import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { ArticleCardViewModel } from '../../../../shared-components/article-card';
import { GroupId } from '../../../../types/group-id';
import { Queries } from '../../../../shared-read-models';
import * as DE from '../../../../types/data-error';

export const constructArticleCards = (
  dependencies: Queries,
  groupId: GroupId,
): TE.TaskEither<DE.DataError, ReadonlyArray<ArticleCardViewModel>> => pipe(
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
  () => TE.right([]),
);
