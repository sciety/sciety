import { URL } from 'url';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructContentWithPaginationViewModel } from './construct-content-with-pagination-view-model.js';
import { getOwnerName } from './get-owner-name.js';
import * as DE from '../../../types/data-error.js';
import { ArticleId } from '../../../types/article-id.js';
import { Dependencies } from './dependencies.js';
import { ViewModel } from '../view-model.js';
import { Params } from './params.js';
import { toExpressionDoisByMostRecentlyAdded } from '../../../read-models/lists/index.js';

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
