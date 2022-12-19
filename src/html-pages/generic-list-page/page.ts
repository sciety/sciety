import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { Ports as ArticlesListPorts, constructContentWithPaginationViewModel } from './articles-list/construct-content-with-pagination-view-model';
import { headers, Ports as HeadersPorts } from './headers';
import { renderPage } from './render-as-html';
import { ContentViewModel, renderErrorPage } from './render-as-html/render-page';
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
  TE.chain((list) => pipe(
    headers(ports)(list, getLoggedInUserIdFromParam(params.user)),
    TE.map((headerViewModel) => ({
      headerViewModel, listOwnerId: list.ownerId, listId: list.listId, list,
    })),
  )),
  TE.chain(({
    headerViewModel, listOwnerId, listId, list,
  }) => pipe(
    ({
      contentViewModel: constructContentViewModel(
        list.articleIds, ports, params, listOwnerId, headerViewModel.editCapability,
      ),
      basePath: TE.right(`/lists/${listId}`),
      title: TE.right(headerViewModel.name),
    }),
    sequenceS(TE.ApplyPar),
    TE.map((partial) => ({
      ...partial,
      ...headerViewModel,
    })),
  )),
  TE.bimap(renderErrorPage, renderPage),
);
