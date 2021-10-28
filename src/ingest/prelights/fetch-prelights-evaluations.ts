import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { extractPrelights } from './extract-prelights';
import { identifyCandidates } from './identify-candidates';
import { FetchData } from '../fetch-data';
import { FetchEvaluations } from '../update-all';

const key = process.env.PRELIGHTS_FEED_KEY ?? '';

type Ports = {
  fetchData: FetchData,
};

export const fetchPrelightsEvaluations = (): FetchEvaluations => (ports: Ports) => pipe(
  ports.fetchData<string>(`https://prelights.biologists.com/feed/sciety/?key=${key}`),
  TE.chainEitherK(identifyCandidates),
  TE.chainTaskK(extractPrelights),
);
