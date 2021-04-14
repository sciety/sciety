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

type FetchArticleDetails = (getLatestArticleVersionDate: GetLatestArticleVersionDate) => (doi: Doi) => TO.TaskOption<{
  title: SanitisedHtmlFragment,
  authors: ReadonlyArray<SanitisedHtmlFragment>,
  latestVersionDate: Date,
}>;

const hardcodedArticleDetails = [
  {
    doi: new Doi('10.1101/2020.09.15.286153'),
    title: pipe('Accuracy of predicting chemical body composition of growing pigs using dual-energy X-ray absorptiometry', toHtmlFragment, sanitise),
    authors: pipe(['Kasper C', 'Schlegel P', 'Ruiz-Ascacibar I', 'Stoll P', 'Bee G'], RA.map(flow(toHtmlFragment, sanitise))),
  },
  {
    doi: new Doi('10.1101/2019.12.20.884056'),
    title: pipe('Determining insulin sensitivity from glucose tolerance tests in Iberian and Landrace pigs', toHtmlFragment, sanitise),
    authors: pipe(['Rodríguez-López J', 'Lachica M', 'González-Valero L', 'Fernández-Fígares I'], RA.map(flow(toHtmlFragment, sanitise))),
  },
  {
    doi: new Doi('10.1101/760082'),
    title: pipe('Effects of feeding treatment on growth rate and performance of primiparous Holstein dairy heifers', toHtmlFragment, sanitise),
    authors: pipe(['Le Cozler Y', 'Jurquet J', 'Bedere N'], RA.map(flow(toHtmlFragment, sanitise))),
  },
  {
    doi: new Doi('10.1101/661249'),
    title: pipe('Lactation curve model with explicit representation of perturbations as a phenotyping tool for dairy livestock precision farming', toHtmlFragment, sanitise),
    authors: pipe(['Ahmed BA', 'Laurence P', 'Pierre G', 'Olivier M'], RA.map(flow(toHtmlFragment, sanitise))),
  },
];

type GetLatestArticleVersionDate = (articleDoi: Doi, server: ArticleServer) => T.Task<O.Option<Date>>;

export const fetchArticleDetails: FetchArticleDetails = (getLatestArticleVersionDate) => (doi) => pipe(
  TO.Do,
  TO.bind('hardcodedDetails', () => pipe(
    hardcodedArticleDetails,
    RA.findFirst((articleDetails) => articleDetails.doi.value === doi.value),
    T.of,
  )),
  TO.bind('server', () => TO.some('biorxiv' as const)),
  TO.bind('latestVersionDate', ({ server }) => pipe(
    [doi, server],
    tupled(getLatestArticleVersionDate),
  )),
  TO.map(({ hardcodedDetails, latestVersionDate }) => ({ ...hardcodedDetails, latestVersionDate })),
);
