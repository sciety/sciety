import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import * as T from 'fp-ts/Task';
import * as E from 'fp-ts/Either';
import { ViewModel } from '../view-model';
import { constructArticleCard } from '../../../../shared-components/paper-activity-summary-card';
import { GroupId } from '../../../../types/group-id';
import * as DE from '../../../../types/data-error';
import { ArticleId } from '../../../../types/article-id';
import { Dependencies } from './dependencies';
import { PageOfItems, paginate } from '../../../../shared-components/pagination';
import { Group } from '../../../../types/group';

const getEvaluatedArticleIds = (dependencies: Dependencies) => (groupId: GroupId) => pipe(
  groupId,
  dependencies.getEvaluatedArticlesListIdForGroup,
  O.chain((listId) => dependencies.lookupList(listId)),
  O.map((list) => list.articleIds),
  E.fromOption(() => DE.notFound),
);

const generateHref = (groupSlug: string) => (page: number) => `/groups/${groupSlug}/feed?page=${page}`;

const toOrderedArticleCards = (
  dependencies: Dependencies,
  groupSlug: string,
) => (
  pageOfArticleIds: PageOfItems<string>,
) => pipe(
  pageOfArticleIds.items,
  T.traverseArray((articleId) => constructArticleCard(dependencies)(new ArticleId(articleId))),
  T.map((articleCards) => ({
    tag: 'ordered-article-cards' as const,
    articleCards,
    backwardPageHref: pipe(
      pageOfArticleIds.prevPage,
      O.map(generateHref(groupSlug)),
    ),
    backwardPageLabel: 'Newer',
    forwardPageHref: pipe(
      pageOfArticleIds.nextPage,
      O.map(generateHref(groupSlug)),
    ),
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
  paginate(pageSize, page),
  E.mapLeft(
    () => ({ tag: 'no-activity-yet' as const }),
  ),
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
