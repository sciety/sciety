import { flow, pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import * as T from 'fp-ts/Task';
import * as E from 'fp-ts/Either';
import { ViewModel } from '../view-model';
import { constructPaperActivitySummaryCard } from '../../../../shared-components/paper-activity-summary-card';
import { GroupId } from '../../../../types/group-id';
import * as DE from '../../../../types/data-error';
import * as EDOI from '../../../../types/expression-doi';
import { Dependencies } from './dependencies';
import { PageOfItems, paginate } from '../../../shared-components/pagination';
import { Group } from '../../../../types/group';
import { toExpressionDoisByMostRecentlyAdded } from '../../../../read-models/lists';
import { buildPaginationHref } from '../../group-followers-page/construct-view-model/construct-view-model';

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
  groupSlug: string,
) => (
  pageOfArticleIds: PageOfItems<string>,
) => pipe(
  pageOfArticleIds.items,
  T.traverseArray((articleId) => constructPaperActivitySummaryCard(dependencies)(EDOI.fromValidatedString(articleId))),
  T.map((articleCards) => ({
    tag: 'ordered-article-cards' as const,
    articleCards,
    backwardPageHref: buildPaginationHref(`/groups/${groupSlug}/feed`, pageOfArticleIds.prevPage),
    backwardPageLabel: 'Newer',
    forwardPageHref: buildPaginationHref(`/groups/${groupSlug}/feed`, pageOfArticleIds.nextPage),
    forwardPageLabel: 'Older',
    page: pageOfArticleIds.pageNumber,
    pageCount: pageOfArticleIds.numberOfPages,
  })),
);

const toPageOfFeedContent = (
  dependencies: Dependencies,
  groupSlug: string,
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
  TE.chainTaskK(toOrderedArticleCards(dependencies, groupSlug)),
  TE.toUnion,
);

export const constructContent = (
  dependencies: Dependencies,
  group: Group,
  pageSize: number,
  page: number,
): TE.TaskEither<DE.DataError, ViewModel['content']> => pipe(
  group.id,
  getEvaluatedArticleIds(dependencies),
  TE.fromEither,
  TE.chainTaskK(toPageOfFeedContent(dependencies, group.slug, pageSize, page)),
);
