import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { extractPrelights } from './extract-prelights';
import { identifyCandidates } from './identify-candidates';
import { FetchData } from '../../fetch-data';
import { DiscoverPublishedEvaluations } from '../../update-all';

const keyFromEnv = pipe(
  process.env.PRELIGHTS_FEED_KEY,
  E.fromNullable('No preLights feed key provided'),
);

type Dependencies = {
  fetchData: FetchData,
};

export const fetchPrelightsEvaluations = (): DiscoverPublishedEvaluations => () => (dependencies: Dependencies) => pipe(
  keyFromEnv,
  TE.fromEither,
  TE.map((key) => `https://prelights.biologists.com/feed/sciety/?key=${key}&hours=120`),
  TE.chain((url) => dependencies.fetchData<string>(url)),
  TE.chainEitherK(identifyCandidates),
  TE.map(extractPrelights),
);
