import axios from 'axios';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Evaluation } from './evaluations';
import { fetchData } from './fetch-data';
import { FetchEvaluations } from './update-all';

type BiorxivItem = {
  biorxiv_doi: string,
  published_doi: string,
};

type BiorxivResponse = {
  messages: Array<{
    cursor: number | string,
    count: number,
    total: number,
  }>,
  collection: Array<BiorxivItem>,
};

type CrossrefResponse = {
  message: {
    items: [
      {
        DOI: string,
        'published-print': {
          'date-parts': [
            [number, number, number],
          ],
        },
      },
    ],
  },
};

const getReviews = (reviewDoiPrefix: string) => (biorxivItem: BiorxivItem) => async () => {
  const result: Array<Evaluation> = [];
  const publishedDoi = biorxivItem.published_doi;
  const biorxivDoi = biorxivItem.biorxiv_doi;
  const headers: Record<string, string> = {
    'User-Agent': 'Sciety (http://sciety.org; mailto:team@sciety.org)',
  };
  if (process.env.CROSSREF_API_BEARER_TOKEN !== undefined) {
    headers['Crossref-Plus-API-Token'] = `Bearer ${process.env.CROSSREF_API_BEARER_TOKEN}`;
  }
  const { data } = await axios.get<CrossrefResponse>(
    `https://api.crossref.org/prefixes/${reviewDoiPrefix}/works?rows=1000&filter=type:peer-review,relation.object:${publishedDoi}`,
    { headers },
  );
  data.message.items.forEach((item) => {
    const [year, month, day] = item['published-print']['date-parts'][0];
    const date = new Date(year, month - 1, day);
    const reviewDoi = item.DOI;
    result.push({
      date,
      articleDoi: biorxivDoi,
      evaluationLocator: `doi:${reviewDoi}`,
    });
  });
  return result;
};

const fetchPage = (baseUrl: string, offset: number): T.Task<ReadonlyArray<BiorxivItem>> => pipe(
  fetchData<BiorxivResponse>(`${baseUrl}/${offset}`),
  TE.fold(
    (error) => { console.log(error); return T.of([]); },
    (data) => T.of(data.collection),
  ),
  T.chain(RA.match(
    () => T.of([]),
    (items) => pipe(
      fetchPage(baseUrl, offset + items.length),
      T.map((next) => [...items, ...next]),
    ),
  )),
);

const identifyCandidates = (
  doiPrefix: string,
  reviewDoiPrefix: string,
) => async (): Promise<ReadonlyArray<Evaluation>> => {
  const startDate = new Date(Date.now() - (60 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
  const today = new Date().toISOString().split('T')[0];
  const baseUrl = `https://api.biorxiv.org/publisher/${doiPrefix}/${startDate}/${today}`;
  return pipe(
    fetchPage(baseUrl, 0),
    T.chain(T.traverseArray(getReviews(reviewDoiPrefix))),
    T.map(RA.flatten),
  )();
};

export const fetchReviewsFromCrossrefViaBiorxiv = (
  doiPrefix: string,
  reviewDoiPrefix: string,
): FetchEvaluations => () => pipe(
  identifyCandidates(doiPrefix, reviewDoiPrefix),
  T.map((evaluations) => ({
    evaluations,
    skippedItems: [],
  })),
  TE.rightTask,
);
