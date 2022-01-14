import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import {
  component as evaluatedArticlesList,
  Ports as EvaluatedArticlesListPorts,
} from './evaluated-articles-list';
import {
  component as header,
  Ports as HeaderPorts,
} from './header';
import { renderErrorPage, renderPage } from './render-page';
import { DomainEvent } from '../domain-events';
import { getGroupBySlug } from '../shared-read-models/groups';
import * as DE from '../types/data-error';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

type Ports = HeaderPorts & EvaluatedArticlesListPorts & {
  getAllEvents: GetAllEvents,
};

export const paramsCodec = t.type({
  slug: t.string,
  page: tt.optionFromNullable(tt.NumberFromString),
});

type Params = t.TypeOf<typeof paramsCodec>;

type ListPage = (params: Params) => TE.TaskEither<RenderPageError, Page>;

const notFoundResponse = () => ({
  type: DE.notFound,
  message: toHtmlFragment('No such group. Please check and try again.'),
} as const);

const toPageNumber = (page: O.Option<number>) => pipe(
  page,
  O.getOrElse(() => 1),
);

export const groupEvaluationsPage = (ports: Ports): ListPage => ({ slug, page }) => pipe(
  ports.getAllEvents,
  T.map(getGroupBySlug(slug)),
  TE.mapLeft(notFoundResponse),
  TE.chain((group) => pipe(
    {
      header: header(ports, group),
      content: evaluatedArticlesList(ports, group, toPageNumber(page)),
    },
    sequenceS(TE.ApplyPar),
    TE.bimap(renderErrorPage, renderPage(group)),
  )),
);
