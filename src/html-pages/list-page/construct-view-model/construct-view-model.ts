import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { Ports as ArticlesListPorts, constructContentWithPaginationViewModel } from '../articles-list/construct-content-with-pagination-view-model';
import { getOwnerInformation, Ports as HeadersPorts } from './get-owner-information';
import { userHasEditCapability } from './user-has-edit-capability';
import { LookupList } from '../../../shared-ports';
import { listIdCodec } from '../../../types/list-id';
import { userIdCodec, UserId } from '../../../types/user-id';
import * as DE from '../../../types/data-error';
import { Doi } from '../../../types/doi';
import { ListOwnerId } from '../../../types/list-owner-id';
import { ContentViewModel, ViewModel } from '../view-model';

export const paramsCodec = t.type({
  page: tt.withFallback(tt.NumberFromString, 1),
  id: listIdCodec,
  user: tt.optionFromNullable(t.type({
    id: userIdCodec,
  })),
});

export type Ports = ArticlesListPorts & HeadersPorts & {
  lookupList: LookupList,
};

export type Params = t.TypeOf<typeof paramsCodec>;

const getLoggedInUserIdFromParam = (user: O.Option<{ id: UserId }>) => pipe(
  user,
  O.map(({ id }) => id),
);

type ConstructContentViewModel = (
  articleIds: ReadonlyArray<string>,
  ports: Ports,
  params: Params,
  listOwnerId: ListOwnerId,
  editCapability: boolean,
) => TE.TaskEither<DE.DataError, ContentViewModel>;

const constructContentViewModel: ConstructContentViewModel = (
  articleIds, ports, params, listOwnerId, editCapability,
) => pipe(
  articleIds,
  RA.map((articleId) => new Doi(articleId)),
  TE.right,
  TE.chainW(
    RA.match<TE.TaskEither<DE.DataError | 'no-articles-can-be-fetched', ContentViewModel>, Doi>(
      () => TE.right('no-articles' as const),
      constructContentWithPaginationViewModel(ports, params.page, editCapability, listOwnerId),
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
      partialPageViewModel.listOwnerId,
      partialPageViewModel.editCapability,
    ),
    TE.map((contentViewModel) => ({
      contentViewModel,
      ...partialPageViewModel,
    })),
  )),
);
