import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { articlesList, Ports as ArticlesListPorts } from './articles-list/articles-list';
import { renderContentWithPagination } from './articles-list/render-content-with-pagination';
import { shouldHaveArticleControls } from './articles-list/should-have-article-controls';
import { noArticlesCanBeFetchedMessage, noArticlesMessage } from './articles-list/static-messages';
import { Ports as GetUserOwnerInformationPorts } from './get-user-owner-information';
import { renderComponent } from './header/render-component';
import { headers } from './headers';
import { renderErrorPage, renderPage } from './render-page';
import { selectArticlesBelongingToList } from '../shared-read-models/list-articles';
import { getList } from '../shared-read-models/lists';
import { ListIdFromString } from '../types/codecs/ListIdFromString';
import { UserIdFromString } from '../types/codecs/UserIdFromString';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';
import { UserId } from '../types/user-id';

export const paramsCodec = t.type({
  page: tt.withFallback(tt.NumberFromString, 1),
  id: ListIdFromString,
  user: tt.optionFromNullable(t.type({
    id: UserIdFromString,
  })),
});

type Ports = ArticlesListPorts & GetUserOwnerInformationPorts;

type Params = t.TypeOf<typeof paramsCodec>;

const getLoggedInUserIdFromParam = (user: O.Option<{ id: UserId }>) => pipe(
  user,
  O.map(({ id }) => id),
);

export const page = (ports: Ports) => (params: Params): TE.TaskEither<RenderPageError, Page> => pipe(
  ports.getAllEvents,
  T.chain(getList(params.id)),
  TE.chain((list) => pipe(
    list,
    headers(ports),
    TE.map((headerViewModel) => ({ headerViewModel, listOwnerId: list.ownerId, listId: list.id })),
  )),
  TE.chain(({ headerViewModel, listOwnerId, listId }) => pipe(
    ({
      header: TE.right(renderComponent(headerViewModel)),
      content: pipe(
        ports.getAllEvents,
        T.map(selectArticlesBelongingToList(listId)),
        TE.chain(RA.match(
          () => TE.right(noArticlesMessage),
          flow(
            articlesList(
              ports,
              params.id,
              params.page,
              shouldHaveArticleControls(
                listOwnerId,
                getLoggedInUserIdFromParam(params.user),
              ),
              listOwnerId,
            ),
            TE.map(renderContentWithPagination(`/lists/${listId}`)),
          ),
        )),
        TE.orElse((left) => {
          if (left === 'no-articles-can-be-fetched') {
            return TE.right(noArticlesCanBeFetchedMessage);
          }
          return TE.left(left);
        }),
      ),
      title: TE.right(headerViewModel.name),
    }),
    sequenceS(TE.ApplyPar),
  )),
  TE.bimap(renderErrorPage, renderPage),
);
