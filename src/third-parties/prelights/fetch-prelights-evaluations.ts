import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { extractPrelights } from './extract-prelights';
import { identifyCandidates } from './identify-candidates';
import { FetchData } from '../../ingest/fetch-data';
import { FetchEvaluations } from '../../ingest/update-all';

const keyFromEnv = pipe(
  process.env.PRELIGHTS_FEED_KEY,
  E.fromNullable('No preLights feed key provided'),
);

type Ports = {
  fetchData: FetchData,
};

export const fetchPrelightsEvaluations = (): FetchEvaluations => (ports: Ports) => pipe(
  keyFromEnv,
  TE.fromEither,
  TE.map((key) => `https://prelights.biologists.com/feed/sciety/?key=${key}&hours=120`),
  TE.chain((url) => ports.fetchData<string>(url)),
  TE.chainEitherK(identifyCandidates),
  TE.map(extractPrelights),
);
