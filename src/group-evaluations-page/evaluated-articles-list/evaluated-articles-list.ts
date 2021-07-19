import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { constant, flow, pipe } from 'fp-ts/function';
import { evaluatedArticles, paginate } from './group-activities';
import { renderRecentGroupActivity } from './render-recent-group-activity';
import { fetchArticleDetails } from '../../shared-components/article-card/fetch-article-details';
import { FindVersionsForArticleDoi, getLatestArticleVersionDate } from '../../shared-components/article-card/get-latest-article-version-date';
import { ArticleServer } from '../../types/article-server';
import * as DE from '../../types/data-error';
import { Doi } from '../../types/doi';
import { DomainEvent } from '../../types/domain-events';
import { Group } from '../../types/group';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';

type Article = {
  title: SanitisedHtmlFragment,
  server: ArticleServer,
  authors: ReadonlyArray<string>,
};

type GetArticle = (id: Doi) => TE.TaskEither<unknown, Article>;

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

export type Ports = {
  fetchArticle: GetArticle,
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
  getAllEvents: GetAllEvents,
};

const getArticleDetails = (ports: Ports) => fetchArticleDetails(
  getLatestArticleVersionDate(ports.findVersionsForArticleDoi),
  flow(ports.fetchArticle, T.map(O.fromEither)),
);

const noActivity = pipe(
  '<p>It looks like this group hasn’t evaluated any articles yet. Try coming back later!</p>',
  toHtmlFragment,
  constant,
);

const addArticleDetails = (ports: Ports) => <A extends { doi: Doi }>(evaluatedArticle: A) => pipe(
  evaluatedArticle.doi,
  getArticleDetails(ports),
  TO.map((articleDetails) => ({
    ...evaluatedArticle,
    ...articleDetails,
  })),
);

type EvaluatedArticlesList = (
  ports: Ports
) => (
  group: Group,
  pageNumber: number
) => TE.TaskEither<DE.DataError, HtmlFragment>;

export const evaluatedArticlesList: EvaluatedArticlesList = (ports) => (group, pageNumber) => pipe(
  ports.getAllEvents,
  T.map(flow(
    evaluatedArticles(group.id),
    paginate(pageNumber, 20),
  )),
  TE.chainW(({ content, nextPageNumber }) => pipe(
    content,
    TO.traverseArray(addArticleDetails(ports)),
    T.map(E.fromOption(() => DE.unavailable)),
    TE.map(RNEA.fromReadonlyArray),
    TE.map(O.fold(
      noActivity,
      flow(
        RNEA.map((articleViewModel) => ({
          ...articleViewModel,
          latestVersionDate: articleViewModel.latestVersionDate,
          latestActivityDate: O.some(articleViewModel.latestActivityDate),
        })),
        renderRecentGroupActivity(pipe(
          nextPageNumber,
          O.map((p) => `/groups/${group.id}/evaluated-articles?page=${p}`),
        )),
      ),
    )),
  )),
);
