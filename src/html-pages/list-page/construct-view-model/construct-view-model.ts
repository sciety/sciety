import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { Ports as ArticlesListPorts, constructContentWithPaginationViewModel } from './construct-content-with-pagination-view-model';
import { getOwnerInformation } from './get-owner-information';
import { userHasEditCapability } from './user-has-edit-capability';
import { ListId, listIdCodec } from '../../../types/list-id';
import { userIdCodec, UserId } from '../../../types/user-id';
import * as DE from '../../../types/data-error';
import { Doi } from '../../../types/doi';
import { ContentViewModel, ViewModel } from '../view-model';
import { Queries } from '../../../shared-read-models';

export const paramsCodec = t.type({
  page: tt.withFallback(tt.NumberFromString, 1),
  id: listIdCodec,
  user: tt.optionFromNullable(t.type({
    id: userIdCodec,
  })),
});

export type Ports = ArticlesListPorts & Queries;

export type Params = t.TypeOf<typeof paramsCodec>;

const getLoggedInUserIdFromParam = (user: O.Option<{ id: UserId }>) => pipe(
  user,
  O.map(({ id }) => id),
);

type ConstructContentViewModel = (
  articleIds: ReadonlyArray<string>,
  ports: Ports,
  params: Params,
  editCapability: boolean,
  listId: ListId,
) => TE.TaskEither<DE.DataError, ContentViewModel>;

const constructContentViewModel: ConstructContentViewModel = (
  articleIds, ports, params, editCapability, listId,
) => pipe(
  articleIds,
  RA.map((articleId) => new Doi(articleId)),
  TE.right,
  TE.chainW(
    RA.match<TE.TaskEither<DE.DataError | 'no-articles-can-be-fetched', ContentViewModel>, Doi>(
      () => TE.right('no-articles' as const),
      constructContentWithPaginationViewModel(ports, params.page, editCapability, listId),
    ),
  ),
  TE.orElse((left) => {
    if (left === 'no-articles-can-be-fetched') {
      return TE.right('no-articles-can-be-fetched' as const);
    }
    return TE.left(left);
  }),
);

export const constructViewModel = (ports: Ports) => (params: Params): TE.TaskEither<DE.DataError, ViewModel> => pipe(
  params.id,
  ports.lookupList,
  O.chain((list) => pipe(
    getOwnerInformation(ports)(list.ownerId),
    O.map((ownerInformation) => ({
      ...ownerInformation,
      ...list,
      listId: list.id,
      basePath: `/lists/${list.id}`,
      articleCount: list.articleIds.length,
      listOwnerId: list.ownerId,
      editCapability: userHasEditCapability(getLoggedInUserIdFromParam(params.user), list.ownerId),
    })),
  )),
  TE.fromOption(() => DE.notFound),
  TE.chain((partialPageViewModel) => pipe(
    constructContentViewModel(
      partialPageViewModel.articleIds,
      ports,
      params,
      partialPageViewModel.editCapability,
      partialPageViewModel.listId,
    ),
    TE.map((contentViewModel) => ({
      contentViewModel,
      ...partialPageViewModel,
    })),
  )),
);
