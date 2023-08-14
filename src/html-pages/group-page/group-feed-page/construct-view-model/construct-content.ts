import { pipe, identity } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import * as T from 'fp-ts/Task';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { ViewModel } from '../view-model';
import {
  constructArticleCardViewModel,
} from '../../../../shared-components/article-card';
import { GroupId } from '../../../../types/group-id';
import * as DE from '../../../../types/data-error';
import { Doi } from '../../../../types/doi';
import { Dependencies } from './dependencies';

export const constructContent = (
  dependencies: Dependencies,
  groupId: GroupId,
): TE.TaskEither<DE.DataError, ViewModel['content']> => pipe(
  groupId,
  dependencies.getEvaluatedArticlesListIdForGroup,
  O.chain((listId) => dependencies.lookupList(listId)),
  O.map((list) => list.articleIds),
  O.match(
    () => TE.left(DE.notFound),
    (articleIds) => pipe(
      articleIds,
      RA.takeLeft(10),
      T.traverseArray((articleId) => constructArticleCardViewModel(dependencies)(new Doi(articleId))),
      T.map(E.right),
      TE.map(RA.matchW(
        () => 'no-activity-yet',
        identity,
      )),
    ),
  ),
);
