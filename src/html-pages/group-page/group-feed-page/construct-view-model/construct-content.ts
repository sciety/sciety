import { identity, pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import * as T from 'fp-ts/Task';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as E from 'fp-ts/Either';
import { ViewModel } from '../view-model';
import { constructArticleCardViewModel } from '../../../../shared-components/article-card';
import { GroupId } from '../../../../types/group-id';
import * as DE from '../../../../types/data-error';
import { Doi } from '../../../../types/doi';
import { Dependencies } from './dependencies';
import { paginate } from '../../../../shared-components/paginate';

const toPageOfFeedContent = (page: number, dependencies: Dependencies) => (articleIds: ReadonlyArray<string>) => pipe(
  articleIds,
  paginate(10, page),
  E.map((pageOfItems) => pageOfItems.items),
  TE.fromEither,
  TE.chainTaskK(
    T.traverseArray((articleId) => constructArticleCardViewModel(dependencies)(new Doi(articleId))),
  ),
  TE.map(RNEA.fromReadonlyArray),
  TE.map(O.matchW(
    () => ({ tag: 'no-activity-yet' as const }),
    (articleCards) => ({ tag: 'ordered-article-cards' as const, articleCards }),
  )),
  TE.match(
    () => ({ tag: 'no-activity-yet' as const }),
    identity,
  ),
  TE.rightTask,
);

export const constructContent = (
  dependencies: Dependencies,
  groupId: GroupId,
  page: number,
): TE.TaskEither<DE.DataError, ViewModel['content']> => pipe(
  groupId,
  dependencies.getEvaluatedArticlesListIdForGroup,
  O.chain((listId) => dependencies.lookupList(listId)),
  O.map((list) => list.articleIds),
  O.match(
    () => TE.left(DE.notFound),
    toPageOfFeedContent(page, dependencies),
  ),
);
