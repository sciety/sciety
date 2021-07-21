import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { constant, flow, pipe } from 'fp-ts/function';
import { paginate } from './paginate';
import { renderEvaluatedArticlesList } from './render-evaluated-articles-list';
import { fetchArticleDetails } from '../../shared-components/article-card/fetch-article-details';
import { FindVersionsForArticleDoi, getLatestArticleVersionDate } from '../../shared-components/article-card/get-latest-article-version-date';
import { ArticleActivity } from '../../types/article-activity';
import { ArticleServer } from '../../types/article-server';
import * as DE from '../../types/data-error';
import { Doi } from '../../types/doi';
import { Group } from '../../types/group';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';

type Article = {
  title: SanitisedHtmlFragment,
  server: ArticleServer,
  authors: ReadonlyArray<string>,
};

type GetArticle = (id: Doi) => TE.TaskEither<unknown, Article>;

export type Ports = {
  fetchArticle: GetArticle,
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
};

const getArticleDetails = (ports: Ports) => fetchArticleDetails(
  getLatestArticleVersionDate(ports.findVersionsForArticleDoi),
  flow(ports.fetchArticle, T.map(O.fromEither)),
);

const noEvaluatedArticles = pipe(
  '<p class="evaluated-articles__empty">It looks like this group hasn’t evaluated any articles yet. Try coming back later!</p>',
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
  articles: ReadonlyArray<ArticleActivity>,
  group: Group,
  pageNumber: number,
  pageSize: number
) => TE.TaskEither<DE.DataError, HtmlFragment>;

export const evaluatedArticlesList: EvaluatedArticlesList = (ports) => (articles, group, pageNumber, pageSize) => pipe(
  articles,
  paginate(pageNumber, pageSize),
  TE.fromEither,
  TE.chainW(({ content, nextPageNumber }) => pipe(
    content,
    TO.traverseArray(addArticleDetails(ports)),
    T.map(E.fromOption(() => DE.unavailable)),
    TE.map(RNEA.fromReadonlyArray),
    TE.map(O.fold(
      noEvaluatedArticles,
      flow(
        RNEA.map((articleViewModel) => ({
          ...articleViewModel,
          latestVersionDate: articleViewModel.latestVersionDate,
          latestActivityDate: O.some(articleViewModel.latestActivityDate),
        })),
        renderEvaluatedArticlesList(pipe(
          nextPageNumber,
          O.map((p) => `/groups/${group.id}/evaluated-articles?page=${p}`),
        )),
      ),
    )),
  )),
);
