import { URL } from 'url';
import * as N from 'fp-ts/number';
import * as Ord from 'fp-ts/Ord';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructContentWithPaginationViewModel } from './construct-content-with-pagination-view-model';
import { getOwnerInformation } from './get-owner-information';
import { userHasEditCapability } from './user-has-edit-capability';
import { ListId } from '../../../types/list-id';
import { UserId } from '../../../types/user-id';
import * as DE from '../../../types/data-error';
import { Dependencies } from './dependencies';
import { ViewModel } from '../view-model';
import { Params } from './params';
import { rawUserInput } from '../../../read-models/annotations/handle-event';
import { ExpressionDoi } from '../../../types/expression-doi';
import { List } from '../../../types/list';

const getLoggedInUserIdFromParam = (user: O.Option<{ id: UserId }>) => pipe(
  user,
  O.map(({ id }) => id),
);

type ConstructContentViewModel = (
  articleIds: ReadonlyArray<string>,
  dependencies: Dependencies,
  params: Params,
  editCapability: boolean,
  listId: ListId,
  entries: List['entries'],
) => TE.TaskEither<DE.DataError, ViewModel['content']>;

const listEntriesByMostRecentlyAdded: Ord.Ord<List['entries'][number]> = pipe(
  N.Ord,
  Ord.reverse,
  Ord.contramap((entry) => entry.addedAtListVersion),
);

const constructContentViewModel: ConstructContentViewModel = (
  articleIds, dependencies, params, editCapability, listId, entries,
) => pipe(
  entries,
  RA.sort(listEntriesByMostRecentlyAdded),
  RA.map((entry) => entry.expressionDoi),
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
    articleCount: list.articleIds.length,
    listOwnerId: list.ownerId,
    relatedArticlesLink: list.articleIds.length > 0
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
      partialPageViewModel.articleIds,
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
