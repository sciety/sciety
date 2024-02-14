import { URL } from 'url';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructContentWithPaginationViewModel } from './construct-content-with-pagination-view-model';
import { getOwnerName } from './get-owner-name';
import * as DE from '../../../types/data-error';
import { ArticleId } from '../../../types/article-id';
import { Dependencies } from './dependencies';
import { ViewModel } from '../view-model';
import { Params } from './params';
import { toExpressionDoisByMostRecentlyAdded } from '../../../read-models/lists';

export const constructViewModel = (
  dependencies: Dependencies,
) => (params: Params): TE.TaskEither<DE.DataError, ViewModel> => pipe(
  params.id,
  dependencies.lookupList,
  O.chain((list) => pipe(
    list.ownerId,
    getOwnerName(dependencies),
    O.map((ownerName) => ({
      ownerName,
      name: list.name,
      updatedAt: list.updatedAt,
      entries: list.entries,
      listId: list.id,
      listPageAbsoluteUrl: new URL(`${process.env.APP_ORIGIN ?? 'https://sciety.org'}/lists/${list.id}`),
    })),
  )),
  TE.fromOption(() => DE.notFound),
  TE.chainTaskK((partialPageViewModel) => pipe(
    partialPageViewModel.entries,
    toExpressionDoisByMostRecentlyAdded,
    RA.map((articleId) => new ArticleId(articleId)),
    constructContentWithPaginationViewModel(dependencies, partialPageViewModel.listId),
    T.map(
      (articles) => ({
        articles,
        ...partialPageViewModel,
      }),
    ),
  )),
);
