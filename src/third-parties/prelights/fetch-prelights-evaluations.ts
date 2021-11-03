import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { extractPrelights } from './extract-prelights';
import { identifyCandidates } from './identify-candidates';
import { FetchData } from '../../ingest/fetch-data';
import { FetchEvaluations } from '../../ingest/update-all';

const key = process.env.PRELIGHTS_FEED_KEY ?? '';

type Ports = {
  fetchData: FetchData,
};

export const fetchPrelightsEvaluations = (): FetchEvaluations => (ports: Ports) => pipe(
  ports.fetchData<string>(`https://prelights.biologists.com/feed/sciety/?key=${key}&hours=120`),
  TE.chainEitherK(identifyCandidates),
  TE.map(extractPrelights),
);
