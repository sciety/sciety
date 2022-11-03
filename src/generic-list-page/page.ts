import { sequenceS } from 'fp-ts/Apply';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { articlesList, Ports as ArticlesListPorts } from './articles-list/articles-list';
import { Ports as GetUserInformationPorts } from './get-user-information';
import { renderComponent } from './header/render-component';
import { headers } from './headers';
import { renderErrorPage, renderPage } from './render-page';
import { ListIdFromString } from '../types/codecs/ListIdFromString';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

export const paramsCodec = t.type({
  page: tt.withFallback(tt.NumberFromString, 1),
  id: ListIdFromString,
});

type Ports = ArticlesListPorts & GetUserInformationPorts;

type Params = t.TypeOf<typeof paramsCodec>;

export const page = (ports: Ports) => (params: Params): TE.TaskEither<RenderPageError, Page> => pipe(
  {
    header: pipe(
      ports.getAllEvents,
      T.chain(headers(ports, params.id)),
      TE.map(renderComponent),
    ),
    content: articlesList(ports, params.id, params.page),
    title: pipe(
      ports.getAllEvents,
      T.chain(headers(ports, params.id)),
      TE.map((header) => header.name),
    ),
  },
  sequenceS(TE.ApplyPar),
  TE.bimap(renderErrorPage, renderPage),
);
