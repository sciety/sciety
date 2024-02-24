import { URL } from 'url';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructContentWithPaginationViewModel } from './construct-content-with-pagination-view-model.js';
import { getOwnerInformation } from './get-owner-information.js';
import { userHasEditCapability } from './user-has-edit-capability.js';
import { ListId } from '../../../types/list-id.js';
import { UserId } from '../../../types/user-id.js';
import * as DE from '../../../types/data-error.js';
import { Dependencies } from './dependencies.js';
import { ViewModel } from '../view-model.js';
import { Params } from './params.js';
import { rawUserInput } from '../../../read-models/annotations/handle-event.js';
import { ExpressionDoi } from '../../../types/expression-doi.js';
import { toExpressionDoisByMostRecentlyAdded, List } from '../../../read-models/lists/index.js';

const getLoggedInUserIdFromParam = (user: O.Option<{ id: UserId }>) => pipe(
  user,
  O.map(({ id }) => id),
);

type ConstructContentViewModel = (
  dependencies: Dependencies,
  params: Params,
  editCapability: boolean,
  listId: ListId,
  entries: List['entries'],
) => TE.TaskEither<DE.DataError, ViewModel['content']>;

const constructContentViewModel: ConstructContentViewModel = (
  dependencies, params, editCapability, listId, entries,
) => pipe(
  entries,
  toExpressionDoisByMostRecentlyAdded,
  TE.right,
  TE.chainW(
    RA.match<TE.TaskEither<DE.DataError | 'no-articles-can-be-fetched', ViewModel['content']>, ExpressionDoi>(
      () => TE.right('no-articles' as const),
      constructContentWithPaginationViewModel(dependencies, params.page, editCapability, listId),
    ),
  ),
  TE.orElse((left) => {
    if (left === 'no-articles-can-be-fetched') {
      return TE.right('no-articles-can-be-fetched' as const);
    }
    return TE.left(left);
  }),
);

export const constructViewModel = (
  dependencies: Dependencies,
) => (params: Params): TE.TaskEither<DE.DataError, ViewModel> => pipe(
  params.id,
  dependencies.lookupList,
  O.map((list) => ({
    ...list,
    listId: list.id,
    description: rawUserInput(list.description),
    basePath: `/lists/${list.id}`,
    articleCount: list.entries.length,
    listOwnerId: list.ownerId,
    relatedArticlesLink: list.entries.length > 0
      ? O.some(`https://labs.sciety.org/lists/by-id/${list.id}/article-recommendations?from-sciety=true`)
      : O.none,
    editCapability: userHasEditCapability(getLoggedInUserIdFromParam(params.user), list.ownerId),
    listPageAbsoluteUrl: new URL(`${process.env.APP_ORIGIN ?? 'https://sciety.org'}/lists/${list.id}`),
    editListDetailsHref: `/lists/${list.id}/edit-details`,
  })),
  O.map((partial) => ({
    ...partial,
    subscribeHref: partial.editCapability ? O.none : O.some(`/lists/${partial.listId}/subscribe`),
  })),
  O.chain((partial) => pipe(
    getOwnerInformation(dependencies)(partial.ownerId),
    O.map((ownerInformation) => ({
      ...ownerInformation,
      ...partial,
    })),
  )),
  TE.fromOption(() => DE.notFound),
  TE.chain((partialPageViewModel) => pipe(
    constructContentViewModel(
      dependencies,
      params,
      partialPageViewModel.editCapability,
      partialPageViewModel.listId,
      partialPageViewModel.entries,
    ),
    TE.map((content) => ({
      content,
      ...partialPageViewModel,
    })),
  )),
  TE.map((partial) => ({
    ...partial,
    showAnnotationSuccessBanner: params.success,
  })),
);
