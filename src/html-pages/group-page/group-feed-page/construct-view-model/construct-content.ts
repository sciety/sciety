import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import * as T from 'fp-ts/Task';
import * as E from 'fp-ts/Either';
import { ViewModel } from '../view-model';
import { constructArticleCardViewModel } from '../../../../shared-components/article-card';
import { GroupId } from '../../../../types/group-id';
import * as DE from '../../../../types/data-error';
import { Doi } from '../../../../types/doi';
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

type SelectedPage = {
  articleIds: ReadonlyArray<string>,
  nextPageHref: O.Option<string>,
};

const buildSelectedPage = (groupSlug: string) => (pageOfItems: PageOfItems<string>) => ({
  articleIds: pageOfItems.items,
  nextPageHref: pipe(
    pageOfItems.nextPage,
    O.map((nextPage) => `/groups/${groupSlug}/feed?page=${nextPage}`),
  ),
});

const toOrderedArticleCards = (
  dependencies: Dependencies,
) => (
  selectedPage: SelectedPage,
) => pipe(
  selectedPage.articleIds,
  T.traverseArray((articleId) => constructArticleCardViewModel(dependencies)(new Doi(articleId))),
  T.map((articleCards) => ({ tag: 'ordered-article-cards' as const, articleCards, nextPageHref: selectedPage.nextPageHref })),
);

const toPageOfFeedContent = (
  dependencies: Dependencies,
  groupSlug: string,
  pageSize: number,
  page: number,
) => (articleIds: ReadonlyArray<string>) => pipe(
  articleIds,
  paginate(pageSize, page),
  E.bimap(
    () => ({ tag: 'no-activity-yet' as const }),
    buildSelectedPage(groupSlug),
  ),
  TE.fromEither,
  TE.chainTaskK(toOrderedArticleCards(dependencies)),
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
