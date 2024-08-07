import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import { toExpressionDoisByMostRecentlyAdded } from '../../../../../read-models/lists';
import * as DE from '../../../../../types/data-error';
import * as EDOI from '../../../../../types/expression-doi';
import { Group } from '../../../../../types/group';
import { GroupId } from '../../../../../types/group-id';
import * as LOID from '../../../../../types/list-id';
import { constructGroupPagePath } from '../../../../paths';
import { constructArticleCard } from '../../../shared-components/article-card';
import { PageOfItems, paginate, constructDefaultPaginationControls } from '../../../shared-components/pagination';
import { ViewModel } from '../view-model';

const getEvaluatedArticleIds = (dependencies: Dependencies) => (groupId: GroupId) => pipe(
  groupId,
  dependencies.getEvaluatedArticlesListIdForGroup,
  O.chain((listId) => dependencies.lookupList(listId)),
  O.map((list) => list.entries),
  O.map(toExpressionDoisByMostRecentlyAdded),
  E.fromOption(() => DE.notFound),
);

const getFeedArticleIdsFromHardcodedAcmiList = (dependencies: Dependencies) => pipe(
  O.some(LOID.fromValidatedString('53fd6f10-af16-4bf4-8473-707ca8daee97')),
  O.chain((listId) => dependencies.lookupList(listId)),
  O.map((list) => list.entries),
  O.map(toExpressionDoisByMostRecentlyAdded),
  E.fromOption(() => DE.notFound),
);

const decideHowToBuildFeed = (dependencies: Dependencies) => (groupId: GroupId) => {
  if (groupId === '4d6a8908-22a9-45c8-bd56-3c7140647709') {
    return getFeedArticleIdsFromHardcodedAcmiList(dependencies);
  }
  return getEvaluatedArticleIds(dependencies)(groupId);
};

const toOrderedArticleCards = (
  dependencies: Dependencies,
  group: Group,
) => (
  pageOfArticleIds: PageOfItems<string>,
) => pipe(
  pageOfArticleIds.items,
  T.traverseArray((articleId) => constructArticleCard(dependencies)(EDOI.fromValidatedString(articleId))),
  T.map((articleCards) => ({
    tag: 'ordered-article-cards' as const,
    articleCards,
    ...constructDefaultPaginationControls(constructGroupPagePath.home.href(group), pageOfArticleIds),
    backwardPageLabel: 'Newer',
    forwardPageLabel: 'Older',
  })),
);

const toPageOfFeedContent = (
  dependencies: Dependencies,
  group: Group,
  pageSize: number,
  page: number,
) => (articleIds: ReadonlyArray<string>) => pipe(
  articleIds,
  E.fromPredicate(
    RA.isNonEmpty,
    () => ({ tag: 'no-activity-yet' as const }),
  ),
  E.chain(flow(
    paginate(pageSize, page),
    E.mapLeft(() => ({ tag: 'no-activity-yet' as const })),
  )),
  TE.fromEither,
  TE.chainTaskK(toOrderedArticleCards(dependencies, group)),
  TE.toUnion,
);

export const constructFeed = (
  dependencies: Dependencies,
  group: Group,
  pageSize: number,
  page: number,
): TE.TaskEither<DE.DataError, ViewModel['feed']> => pipe(
  group.id,
  decideHowToBuildFeed(dependencies),
  TE.fromEither,
  TE.chainTaskK(toPageOfFeedContent(dependencies, group, pageSize, page)),
);
