import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { constructSortedFeed } from './construct-sorted-feed';
import { Dependencies } from './dependencies';
import { toExpressionDoisByMostRecentlyAdded } from '../../../../../read-models/lists';
import { constructGroupPagePath } from '../../../../../standards/paths';
import * as DE from '../../../../../types/data-error';
import * as EDOI from '../../../../../types/expression-doi';
import { Group } from '../../../../../types/group';
import { GroupId } from '../../../../../types/group-id';
import * as GID from '../../../../../types/group-id';
import { constructArticleCardStack } from '../../../shared-components/article-card-stack';
import { PageOfItems, paginate, constructDefaultPaginationControls } from '../../../shared-components/pagination';
import { ViewModel } from '../view-model';

const getEvaluatedExpressionDois = (dependencies: Dependencies) => (groupId: GroupId) => pipe(
  groupId,
  dependencies.getEvaluatedArticlesListIdForGroup,
  O.chain((listId) => dependencies.lookupList(listId)),
  O.map((list) => list.entries),
  O.map(toExpressionDoisByMostRecentlyAdded),
  E.fromOption(() => DE.notFound),
);

const toOrderedArticleCards = (
  dependencies: Dependencies,
  group: Group,
) => (
  pageOfExpressionDois: PageOfItems<string>,
) => pipe(
  pageOfExpressionDois.items,
  RA.map(EDOI.fromValidatedString),
  constructArticleCardStack(dependencies),
  T.map((articleCards) => ({
    tag: 'ordered-article-cards' as const,
    articleCards,
    ...constructDefaultPaginationControls(constructGroupPagePath.home.href(group), pageOfExpressionDois),
    backwardPageLabel: 'Newer',
    forwardPageLabel: 'Older',
  })),
);

const toPageOfFeedContent = (
  dependencies: Dependencies,
  group: Group,
  pageSize: number,
  page: number,
) => (expressionDois: ReadonlyArray<string>) => pipe(
  expressionDois,
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

const getExpressionDoisForFeed = (dependencies: Dependencies) => (groupId: GroupId) => {
  if (process.env.EXPERIMENT_ENABLED === 'true' && groupId === GID.fromValidatedString('4d6a8908-22a9-45c8-bd56-3c7140647709')) {
    return E.right(constructSortedFeed(dependencies, groupId));
  }
  return getEvaluatedExpressionDois(dependencies)(groupId);
};

export const constructFeed = (
  dependencies: Dependencies,
  group: Group,
  pageSize: number,
  page: number,
): TE.TaskEither<DE.DataError, ViewModel['feed']> => pipe(
  group.id,
  getExpressionDoisForFeed(dependencies),
  TE.fromEither,
  TE.chainTaskK(toPageOfFeedContent(dependencies, group, pageSize, page)),
);
