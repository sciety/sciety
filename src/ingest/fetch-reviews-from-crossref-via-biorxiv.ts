/* eslint-disable no-loops/no-loops */
import axios from 'axios';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Evaluation } from './evaluations';
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

const getReviews = (reviewDoiPrefix: string) => async (biorxivItem: BiorxivItem) => {
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

const identifyCandidates = (
  doiPrefix: string,
  reviewDoiPrefix: string,
) => async (): Promise<ReadonlyArray<Evaluation>> => {
  const startDate = new Date(Date.now() - (60 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
  const today = new Date().toISOString().split('T')[0];
  const result: Array<Evaluation> = [];
  let offset = 0;
  let total: number;
  do {
    const { data: biorxivData } = await axios.get<BiorxivResponse>(
      `https://api.biorxiv.org/publisher/${doiPrefix}/${startDate}/${today}/${offset}`,
    );
    const { count } = biorxivData.messages[0];
    total = biorxivData.messages[0].total;
    for (const biorxivItem of biorxivData.collection) {
      result.concat(await getReviews(reviewDoiPrefix)(biorxivItem));
    }
    offset += count;
  } while (offset < total);
  return result;
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
