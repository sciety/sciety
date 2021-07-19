import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { evaluatedArticlesList, Ports as EvaluatedArticlesListPorts } from './evaluated-articles-list';
import { evaluatedArticles } from './evaluated-articles-list/group-activities';
import { renderErrorPage, renderPage } from './render-page';
import { GroupIdFromString } from '../types/codecs/GroupIdFromString';
import * as DE from '../types/data-error';
import { DomainEvent } from '../types/domain-events';
import { Group } from '../types/group';
import { GroupId } from '../types/group-id';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

type FetchGroup = (groupId: GroupId) => TO.TaskOption<Group>;

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

type Ports = EvaluatedArticlesListPorts & {
  getAllEvents: GetAllEvents,
  getGroup: FetchGroup,
};

export const paramsCodec = t.type({
  id: GroupIdFromString,
  page: tt.optionFromNullable(tt.NumberFromString),
});

type Params = t.TypeOf<typeof paramsCodec>;

type GroupEvaluationsPage = (params: Params) => TE.TaskEither<RenderPageError, Page>;

const notFoundResponse = () => ({
  type: DE.notFound,
  message: toHtmlFragment('No such group. Please check and try again.'),
} as const);

export const groupEvaluationsPage = (ports: Ports): GroupEvaluationsPage => ({ id, page }) => pipe(
  ports.getGroup(id),
  T.map(E.fromOption(notFoundResponse)),
  TE.chainTaskK((group) => pipe(
    ports.getAllEvents,
    T.map(evaluatedArticles(group.id)),
    T.map((articles) => ({
      group,
      articles,
    })),
  )),
  TE.chain(({ group, articles }) => pipe(
    {
      header: pipe(
        `<header class="page-header page-header--search-results">
          <h1 class="page-heading--search">
            Evaluated Articles
          </h1>
          <p>A list by <a href="/groups/${group.id}">${group.name}</a></p>
          <p>Articles that have been evaluated by ${group.name}, most recently evaluated first.</p>
          <p>${articles.length} articles</p>
        </header>`,
        toHtmlFragment,
        TE.right,
      ),
      evaluatedArticlesList: evaluatedArticlesList(ports)(articles, group, O.getOrElse(() => 1)(page)),
    },
    sequenceS(TE.ApplyPar),
    TE.bimap(renderErrorPage, renderPage(group)),
  )),
);
