import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import { toExpressionDoisByMostRecentlyAdded } from '../../../../../read-models/lists';
import { constructPaperActivitySummaryCard } from '../../../../../shared-components/paper-activity-summary-card';
import * as DE from '../../../../../types/data-error';
import * as EDOI from '../../../../../types/expression-doi';
import { Group } from '../../../../../types/group';
import { GroupId } from '../../../../../types/group-id';
import { constructGroupPageHref } from '../../../../paths';
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

const toOrderedArticleCards = (
  dependencies: Dependencies,
  group: Group,
) => (
  pageOfArticleIds: PageOfItems<string>,
) => pipe(
  pageOfArticleIds.items,
  T.traverseArray((articleId) => constructPaperActivitySummaryCard(dependencies)(EDOI.fromValidatedString(articleId))),
  T.map((articleCards) => ({
    tag: 'ordered-article-cards' as const,
    articleCards,
    ...constructDefaultPaginationControls(constructGroupPageHref(group), pageOfArticleIds),
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
  getEvaluatedArticleIds(dependencies),
  TE.fromEither,
  TE.chainTaskK(toPageOfFeedContent(dependencies, group, pageSize, page)),
);
