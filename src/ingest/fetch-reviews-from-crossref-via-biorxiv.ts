import * as RA from 'fp-ts/ReadonlyArray';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { fetchData } from './fetch-data';
import { FetchEvaluations } from './update-all';
import * as CR from '../third-parties/crossref';

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

type CrossrefReview = CR.CrossrefItem & {
  biorxivDoi: string,
};

const getReviews = (reviewDoiPrefix: string) => (biorxivItem: BiorxivItem) => pipe(
  biorxivItem.published_doi,
  CR.fetchReviewsBy(reviewDoiPrefix),
  TE.map(RA.map((item) => ({
    ...item,
    biorxivDoi: biorxivItem.biorxiv_doi,
  }))),
);

const toEvaluation = (review: CrossrefReview) => {
  const [year, month, day] = review['published-print']['date-parts'][0];
  const date = new Date(year, month - 1, day);
  const reviewDoi = review.DOI;
  return {
    date,
    articleDoi: review.biorxivDoi,
    evaluationLocator: `doi:${reviewDoi}`,
    authors: [],
  };
};

const unfoldTE = <Item, NextValue, F>(
  seedValue: NextValue,
  fn: (value: NextValue) => TE.TaskEither<F, O.Option<[Item, NextValue]>>,
) => async (): Promise<E.Either<F, ReadonlyArray<Item>>> => {
    const accumulator: Array<Item> = [];
    let value = seedValue;

    // eslint-disable-next-line no-loops/no-loops, no-constant-condition
    while (true) {
      const maybeFailed = await fn(value)();
      if (E.isLeft(maybeFailed)) {
        return maybeFailed;
      }

      const maybeEmpty = maybeFailed.right;
      if (O.isNone(maybeEmpty)) {
        break;
      }

      const [items, nextValue] = maybeEmpty.value;
      accumulator.push(items);
      value = nextValue;
    }

    return pipe(
      accumulator,
      E.right,
    );
  };

const fetchPaginatedData = (
  baseUrl: string,
) => (
  offset: number,
): TE.TaskEither<string, O.Option<[ReadonlyArray<BiorxivItem>, number]>> => pipe(
  fetchData<BiorxivResponse>(`${baseUrl}/${offset}`),
  TE.map((response) => response.collection),
  TE.map(RA.match(
    () => O.none,
    (items) => O.some([items, offset + items.length]),
  )),
);

const identifyCandidates = (doiPrefix: string, reviewDoiPrefix: string) => {
  const startDate = new Date(Date.now() - (600 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
  const today = new Date().toISOString().split('T')[0];
  const baseUrl = `https://api.biorxiv.org/publisher/${doiPrefix}/${startDate}/${today}`;
  return pipe(
    unfoldTE(0, fetchPaginatedData(baseUrl)),
    TE.map(RA.flatten),
    TE.map((data) => { console.log('>>>>', data.length); return []; }),
    TE.chain(TE.traverseArray(getReviews(reviewDoiPrefix))),
    TE.map(RA.flatten),
  );
};

export const fetchReviewsFromCrossrefViaBiorxiv = (
  doiPrefix: string,
  reviewDoiPrefix: string,
): FetchEvaluations => () => pipe(
  identifyCandidates(doiPrefix, reviewDoiPrefix),
  TE.map(RA.map(toEvaluation)),
  TE.map((evaluations) => ({
    evaluations,
    skippedItems: [],
  })),
);
