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
import * as DE from '../types/data-error';
import { Group } from '../types/group';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

type Ports = HeaderPorts & EvaluatedArticlesListPorts & {
  getAllEvents: GetAllEvents,
  getGroupBySlug: (groupSlug: string) => TE.TaskEither<DE.DataError, Group>,
};

export const paramsCodec = t.type({
  slug: t.string,
  page: tt.optionFromNullable(tt.NumberFromString),
});

type Params = t.TypeOf<typeof paramsCodec>;

type GroupEvaluationsPage = (params: Params) => TE.TaskEither<RenderPageError, Page>;

const notFoundResponse = () => ({
  type: DE.notFound,
  message: toHtmlFragment('No such group. Please check and try again.'),
} as const);

const toPageNumber = (page: O.Option<number>) => pipe(
  page,
  O.getOrElse(() => 1),
);

export const groupEvaluationsPage = (ports: Ports): GroupEvaluationsPage => ({ slug, page }) => pipe(
  ports.getGroupBySlug(slug),
  TE.mapLeft(notFoundResponse),
  TE.chain((group) => pipe(
    {
      header: header(ports, group),
      evaluatedArticlesList: evaluatedArticlesList(ports, group, toPageNumber(page)),
    },
    sequenceS(TE.ApplyPar),
    TE.bimap(renderErrorPage, renderPage(group)),
  )),
);
