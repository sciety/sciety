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
import { paginate } from '../../../../shared-components/paginate';

const toOrderedArticleCards = (dependencies: Dependencies) => (articleIds: ReadonlyArray<string>) => pipe(
  articleIds,
  T.traverseArray((articleId) => constructArticleCardViewModel(dependencies)(new Doi(articleId))),
  T.map((articleCards) => ({ tag: 'ordered-article-cards' as const, articleCards })),
);

const toPageOfFeedContent = (page: number, dependencies: Dependencies) => (articleIds: ReadonlyArray<string>) => pipe(
  articleIds,
  paginate(10, page),
  E.bimap(
    () => ({ tag: 'no-activity-yet' as const }),
    (pageOfItems) => pageOfItems.items,
  ),
  TE.fromEither,
  TE.chainTaskK(toOrderedArticleCards(dependencies)),
  TE.toUnion,
);

const getEvaluatedArticleIds = (dependencies: Dependencies) => (groupId: GroupId) => pipe(
  groupId,
  dependencies.getEvaluatedArticlesListIdForGroup,
  O.chain((listId) => dependencies.lookupList(listId)),
  O.map((list) => list.articleIds),
  E.fromOption(() => DE.notFound),
);

export const constructContent = (
  dependencies: Dependencies,
  groupId: GroupId,
  page: number,
): TE.TaskEither<DE.DataError, ViewModel['content']> => pipe(
  groupId,
  getEvaluatedArticleIds(dependencies),
  TE.fromEither,
  TE.chainTaskK(toPageOfFeedContent(page, dependencies)),
);
