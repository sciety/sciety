import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { evaluatedArticlesList, Ports as EvaluatedArticlesListPorts } from './evaluated-articles-list';
import { evaluatedArticles } from './evaluated-articles-list/evaluated-articles';
import { renderErrorPage, renderPage } from './render-page';
import { DomainEvent } from '../domain-events';
import { getEvaluatedArticlesListDetails } from '../group-page/lists/get-evaluated-articles-list-details';
import { defaultGroupListDescription } from '../group-page/messages';
import { templateDate } from '../shared-components/date';
import * as DE from '../types/data-error';
import { Group } from '../types/group';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

type Ports = EvaluatedArticlesListPorts & {
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

const renderArticleCount = (articleCount: number) => pipe(
  articleCount === 1,
  (singular) => `<span>${articleCount} ${singular ? 'article' : 'articles'}</span>`,
);

const renderLastUpdated = O.fold(
  () => '',
  (date: Date) => `<span>Last updated ${templateDate(date)}</span>`,
);

const renderHeader = (group: Group, articleCount: number, lastUpdated: O.Option<Date>) => pipe(
  `<header class="page-header page-header--group-evaluations">
    <h1>
      Evaluated Articles
    </h1>
    <p class="page-header__subheading">
      <img src="${group.avatarPath}" alt="" class="page-header__avatar">
      <span>A list by <a href="/groups/${group.slug}">${group.name}</a></span>
    </p>
    <p class="page-header__description">${defaultGroupListDescription(group.name)}.</p>
    <p class="page-header__meta"><span class="visually-hidden">This list contains </span>${renderArticleCount(articleCount)}${renderLastUpdated(lastUpdated)}</p>
  </header>`,
  toHtmlFragment,
);

export const groupEvaluationsPage = (ports: Ports): GroupEvaluationsPage => ({ slug, page }) => pipe(
  ports.getGroupBySlug(slug),
  TE.mapLeft(notFoundResponse),
  TE.chainTaskK((group) => pipe(
    ports.getAllEvents,
    T.map((events) => ({
      group,
      articles: evaluatedArticles(group.id)(events),
      ...getEvaluatedArticlesListDetails(group.id)(events),
      pageSize: 20,
    })),
  )),
  TE.chain(({
    group, articles, articleCount, lastUpdated, pageSize,
  }) => pipe(
    {
      header: pipe(
        renderHeader(group, articleCount, lastUpdated),
        TE.right,
      ),
      evaluatedArticlesList: evaluatedArticlesList(ports)(articles, group, O.getOrElse(() => 1)(page), pageSize),
    },
    sequenceS(TE.ApplyPar),
    TE.bimap(renderErrorPage, renderPage(group)),
  )),
);
