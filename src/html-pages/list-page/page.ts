import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { Ports as ArticlesListPorts, constructContentWithPaginationViewModel } from './articles-list/construct-content-with-pagination-view-model';
import { getOwnerInformation, Ports as HeadersPorts } from './get-owner-information';
import { renderPage } from './render-as-html';
import { ContentViewModel, renderErrorPage } from './render-as-html/render-page';
import { userHasEditCapability } from './user-has-edit-capability';
import { GetList } from '../../shared-ports';
import { ListIdFromString } from '../../types/codecs/ListIdFromString';
import { UserIdFromString } from '../../types/codecs/UserIdFromString';
import * as DE from '../../types/data-error';
import { Doi } from '../../types/doi';
import { ListOwnerId } from '../../types/list-owner-id';
import { Page } from '../../types/page';
import { RenderPageError } from '../../types/render-page-error';
import { UserId } from '../../types/user-id';

export const paramsCodec = t.type({
  page: tt.withFallback(tt.NumberFromString, 1),
  id: ListIdFromString,
  user: tt.optionFromNullable(t.type({
    id: UserIdFromString,
  })),
});

type Ports = ArticlesListPorts
& HeadersPorts
& {
  getList: GetList,
};

type Params = t.TypeOf<typeof paramsCodec>;

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
      constructContentWithPaginationViewModel(
        ports,
        params.id,
        params.page,
        editCapability,
        listOwnerId,
      ),
    ),
  ),
  TE.orElse((left) => {
    if (left === 'no-articles-can-be-fetched') {
      return TE.right('no-articles-can-be-fetched' as const);
    }
    return TE.left(left);
  }),
);

export const page = (ports: Ports) => (params: Params): TE.TaskEither<RenderPageError, Page> => pipe(
  params.id,
  ports.getList,
  TE.fromOption(() => DE.notFound),
  TE.chainEitherK((list) => pipe(
    getOwnerInformation(ports)(list.ownerId),
    E.map((ownerInformation) => ({
      ...ownerInformation,
      ...list,
      basePath: `/lists/${list.listId}`,
      title: list.name,
      articleCount: list.articleIds.length,
      listOwnerId: list.ownerId,
      editCapability: userHasEditCapability(getLoggedInUserIdFromParam(params.user), list.ownerId),
    })),
  )),
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
  TE.bimap(renderErrorPage, renderPage),
);
