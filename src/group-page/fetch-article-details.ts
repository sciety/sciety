import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import { flow, pipe, tupled } from 'fp-ts/function';
import { ArticleServer } from '../types/article-server';
import { Doi } from '../types/doi';
import { toHtmlFragment } from '../types/html-fragment';
import { sanitise, SanitisedHtmlFragment } from '../types/sanitised-html-fragment';

export type FindVersionsForArticleDoi = (
  doi: Doi,
  server: ArticleServer,
) => T.Task<O.Option<RNEA.ReadonlyNonEmptyArray<{ occurredAt: Date }>>>;

type GetArticle = (doi: Doi) => TO.TaskOption<{ title: SanitisedHtmlFragment, server: ArticleServer }>;

type FetchArticleDetails = (
  getLatestArticleVersionDate: GetLatestArticleVersionDate,
  getArticle: GetArticle,
) => (doi: Doi) => TO.TaskOption<{
  title: SanitisedHtmlFragment,
  authors: ReadonlyArray<SanitisedHtmlFragment>,
  latestVersionDate: Date,
}>;

const hardcodedArticleDetails = [
  {
    doi: new Doi('10.1101/2020.09.15.286153'),
    authors: pipe(['Kasper C', 'Schlegel P', 'Ruiz-Ascacibar I', 'Stoll P', 'Bee G'], RA.map(flow(toHtmlFragment, sanitise))),
  },
  {
    doi: new Doi('10.1101/2019.12.20.884056'),
    authors: pipe(['Rodríguez-López J', 'Lachica M', 'González-Valero L', 'Fernández-Fígares I'], RA.map(flow(toHtmlFragment, sanitise))),
  },
  {
    doi: new Doi('10.1101/760082'),
    authors: pipe(['Le Cozler Y', 'Jurquet J', 'Bedere N'], RA.map(flow(toHtmlFragment, sanitise))),
  },
  {
    doi: new Doi('10.1101/661249'),
    authors: pipe(['Ahmed BA', 'Laurence P', 'Pierre G', 'Olivier M'], RA.map(flow(toHtmlFragment, sanitise))),
  },
];

type GetLatestArticleVersionDate = (articleDoi: Doi, server: ArticleServer) => TO.TaskOption<Date>;

export const fetchArticleDetails: FetchArticleDetails = (getLatestArticleVersionDate, getArticle) => (doi) => pipe(
  TO.Do,
  TO.apS('hardcodedDetails', pipe(
    hardcodedArticleDetails,
    RA.findFirst((articleDetails) => articleDetails.doi.value === doi.value),
    T.of,
  )),
  TO.apS('article', getArticle(doi)),
  TO.bind('latestVersionDate', ({ article }) => pipe(
    [doi, article.server],
    tupled(getLatestArticleVersionDate),
  )),
  TO.map(({ hardcodedDetails, latestVersionDate, article }) => ({
    ...hardcodedDetails,
    title: article.title,
    latestVersionDate,
  })),
);
