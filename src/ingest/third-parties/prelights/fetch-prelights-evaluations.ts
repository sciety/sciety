import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { extractPrelights } from './extract-prelights';
import { identifyCandidates } from './identify-candidates';
import { DiscoverPublishedEvaluations } from '../../discover-published-evaluations';

export const fetchPrelightsEvaluations = (
  prelightsFeedKey: string,
): DiscoverPublishedEvaluations => () => (dependencies) => pipe(
  prelightsFeedKey,
  (key) => `https://prelights.biologists.com/feed/sciety/?key=${key}&hours=120`,
  (url) => dependencies.fetchData<string>(url),
  TE.chainEitherK(identifyCandidates),
  TE.map(extractPrelights),
);
