import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { articlesList, Ports as ArticlesListPorts } from './articles-list/articles-list';
import { Ports as GetUserOwnerInformationPorts } from './get-user-owner-information';
import { renderComponent } from './header/render-component';
import { headers } from './headers';
import { renderErrorPage, renderPage } from './render-page';
import { getList } from '../shared-read-models/lists';
import { ListIdFromString } from '../types/codecs/ListIdFromString';
import { UserIdFromString } from '../types/codecs/UserIdFromString';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

export const paramsCodec = t.type({
  page: tt.withFallback(tt.NumberFromString, 1),
  id: ListIdFromString,
  user: tt.optionFromNullable(t.type({
    id: UserIdFromString,
  })),
});

type Ports = ArticlesListPorts & GetUserOwnerInformationPorts;

type Params = t.TypeOf<typeof paramsCodec>;

export const page = (ports: Ports) => (params: Params): TE.TaskEither<RenderPageError, Page> => pipe(
  ports.getAllEvents,
  T.chain(getList(params.id)),
  TE.chain(headers(ports)),
  TE.chain((h) => pipe(
    ({
      header: TE.right(renderComponent(h)),
      content: articlesList(
        ports,
        params.id,
        params.page,
        pipe(params.user, O.map((user) => user.id)),
      ),
      title: TE.right(h.name),
    }),
    sequenceS(TE.ApplyPar),
  )),
  TE.bimap(renderErrorPage, renderPage),
);
