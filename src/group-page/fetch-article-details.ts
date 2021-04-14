import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { flow, identity, pipe } from 'fp-ts/function';
import { Doi } from '../types/doi';
import { toHtmlFragment } from '../types/html-fragment';
import { sanitise, SanitisedHtmlFragment } from '../types/sanitised-html-fragment';

type FetchArticleDetails = (doi: Doi) => T.Task<{
  title: SanitisedHtmlFragment,
  authors: ReadonlyArray<SanitisedHtmlFragment>,
  latestVersionDate: Date,
}>;

const hardcodedArticleDetails = [
  {
    doi: new Doi('10.1101/2020.09.15.286153'),
    title: pipe('Accuracy of predicting chemical body composition of growing pigs using dual-energy X-ray absorptiometry', toHtmlFragment, sanitise),
    authors: pipe(['Kasper C', 'Schlegel P', 'Ruiz-Ascacibar I', 'Stoll P', 'Bee G'], RA.map(flow(toHtmlFragment, sanitise))),
    latestVersionDate: new Date('2020-12-14'),
  },
  {
    doi: new Doi('10.1101/2019.12.20.884056'),
    title: pipe('Determining insulin sensitivity from glucose tolerance tests in Iberian and Landrace pigs', toHtmlFragment, sanitise),
    authors: pipe(['Rodríguez-López J', 'Lachica M', 'González-Valero L', 'Fernández-Fígares I'], RA.map(flow(toHtmlFragment, sanitise))),
    latestVersionDate: new Date('2020-10-14'),
  },
  {
    doi: new Doi('10.1101/760082'),
    title: pipe('Effects of feeding treatment on growth rate and performance of primiparous Holstein dairy heifers', toHtmlFragment, sanitise),
    authors: pipe(['Le Cozler Y', 'Jurquet J', 'Bedere N'], RA.map(flow(toHtmlFragment, sanitise))),
    latestVersionDate: new Date('2019-12-05'),
  },
  {
    doi: new Doi('10.1101/661249'),
    title: pipe('Lactation curve model with explicit representation of perturbations as a phenotyping tool for dairy livestock precision farming', toHtmlFragment, sanitise),
    authors: pipe(['Ahmed BA', 'Laurence P', 'Pierre G', 'Olivier M'], RA.map(flow(toHtmlFragment, sanitise))),
    latestVersionDate: new Date('2019-08-27'),
  },
];

export const fetchArticleDetails: FetchArticleDetails = (doi) => pipe(
  hardcodedArticleDetails,
  RA.findFirst((articleDetails) => articleDetails.doi.value === doi.value),
  O.fold(
    () => { throw new Error('Missing hardcoded data'); },
    identity,
  ),
  T.of,
);
