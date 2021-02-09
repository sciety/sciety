import { URL } from 'url';
import { namedNode } from '@rdfjs/data-model';
import { schema } from '@tpluscode/rdf-ns-builders';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import {
  constant, flow, identity, pipe,
} from 'fp-ts/function';
import type { NamedNode } from 'rdf-js';
import { FetchDataset } from './fetch-dataset';
import { Logger } from './logger';
import { Review } from './review';
import { Doi } from '../types/doi';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export type FetchDataciteReview = (doi: Doi) => T.Task<Review>;

const hardcodedNCRCReview = toHtmlFragment(`
  <h3>Our take</h3>
  <p>
    This study provides convincing rationale to explore administering only one dose of mRNA vaccine to individuals who possess pre-existing SARS-CoV-2 immunity from previous infection. Antibody testing could be performed prior to vaccination for individuals whose infection history is unknown. This strategy could free up a vast number of vaccine doses, as well as limit discomfort from reactogenicity in those who have pre-existing immunity.
  </p>
  <h3>Study design</h3>
  <p>
    Other
  </p>
  <h3>Study population and setting</h3>
  <p>
    This study investigated individuals who had been vaccinated with either Pfizer or Moderna’s mRNA vaccine in 2020. Antibody responses were studied in 109 participants with and without documented pre-existing SARS-CoV-2 antibody responses (68 seronegative, 41 seropositive). The frequency of local, injection site-related and systemic reactions after first dose of vaccination in 231 participants (149 seronegative, 83 seropositive) was also investigated.
  </p>
  <h3>Summary of main findings</h3>
  <p>
    While seronegative participants mounted low SARS-CoV-2 IgG antibody responses 9-12 days after their first vaccination, seropositive individuals developed antibody titers 10-12 times higher within only days of their first vaccination. Futher, seropositive participants’ antibody titers following their first vaccination were over 10-fold higher than titers measured in seronegative individuals after their second vaccine. Next, mild, local reactions did not differ based on serostatus. However, seropositive individuals had a significantly higher frequency of systemic side effects (ex. fever, chills, fatigue, muscle and joint pains, headache) compared to seronegative individuals. Reactogenicity for seropositive individuals after first dose seemed to resemble reactions of seronegative individuals after their second dose, as reported in phase 3 trials.
  </p>
  <h3>Study strengths</h3>
  <p>
    This study employed a mixture of participants who received either the Pfizer or Moderna mRNA vaccines, which are the two vaccines that have been approved for use by the FDA in the US. Also, they were able to obtain a decent sample size for a first look into this question.
  </p>
  <h3>Limitations</h3>
  <p>
    More seronegative participants were included in this study than seropositive individuals and the groups were not paired in a case-control format.
  </p>
  <h3>Value added</h3>
  <p>
    First concrete rationale for administering only one vaccine dose to those who already have some level of pre-existing SARS-CoV-2 immunity from previous infection.
  </p>
`);

type FoundReview = {
  fullText: HtmlFragment,
  url: URL,
};

const fetchReviewContent = (
  fetchDataset: FetchDataset,
  logger: Logger,
  reviewIri: NamedNode,
): TE.TaskEither<'unavailable', FoundReview> => pipe(
  TE.tryCatch(
    async () => fetchDataset(reviewIri),
    constant('unavailable' as const), // TODO might be 'not-found'
  ),
  TE.chain(flow(
    (graph) => graph.out(schema.description).value,
    E.fromNullable('unavailable' as const),
    E.map(toHtmlFragment),
    E.map((fullText) => ({
      fullText,
      url: new URL(reviewIri.value),
    })),
    TE.fromEither,
  )),
  TE.map((review) => {
    logger('debug', 'Retrieved review', { review });
    return review;
  }),
);

const onlyUrl = (url: string): Review => (
  {
    fullText: O.none,
    url: new URL(url),
  }
);

export const createFetchDataciteReview = (fetchDataset: FetchDataset, logger: Logger): FetchDataciteReview => (
  (doi) => {
    if (process.env.EXPERIMENT_ENABLED === 'true' && doi.value === '10.1101/hardcoded-fake-ncrc-review-id') {
      return T.of({
        url: new URL('https://ncrc.jhsph.edu/research/robust-spike-antibody-responses-and-increased-reactogenicity-in-seropositive-individuals-after-a-single-dose-of-sars-cov-2-mrna-vaccine/'),
        fullText: O.some(hardcodedNCRCReview),
      });
    }
    return pipe(
      doi,
      (d) => `https://doi.org/${d.value}`,
      (url) => {
        logger('debug', 'Fetching review from Datacite', { url });
        return url;
      },
      namedNode,
      TE.right,
      TE.chain((reviewIri) => pipe(
        fetchReviewContent(fetchDataset, logger, reviewIri),
        TE.bimap(
          () => onlyUrl(reviewIri.value),
          (review) => ({ ...review, fullText: O.some(review.fullText) }),
        ),
      )),
      T.map(E.fold(identity, identity)),
    );
  }
);
