import axios from 'axios';
import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import * as PR from 'io-ts/PathReporter';
import { DoiFromString } from '../src/types/codecs/DoiFromString';
import { Doi, isDoi } from '../src/types/doi';
import * as ReviewId from '../src/types/review-id';

const preReviewPreprint = t.type({
  handle: t.union([DoiFromString, t.string]),
  fullReviews: t.readonlyArray(t.type({
    createdAt: tt.DateFromISOString,
    doi: tt.optionFromNullable(DoiFromString),
  })),
});

const preReviewResponse = t.type({
  data: t.readonlyArray(preReviewPreprint),
});

type PreReviewPreprint = t.TypeOf<typeof preReviewPreprint>;

type Review = {
  date: Date,
  articleDoi: Doi,
  reviewId: ReviewId.ReviewId,
};

type Preprint = {
  handle: Doi,
  fullReviews: ReadonlyArray<{
    createdAt: Date,
    doi: Doi,
  }>,
};

const biorxivPrefix = '10.1101';

const toPreprint = flow(
  (preprint: PreReviewPreprint) => O.some(preprint),
  O.filter((preprint): preprint is PreReviewPreprint & { handle: Doi } => isDoi(preprint.handle)),
  O.filter((preprint) => preprint.handle.hasPrefix(biorxivPrefix)),
  O.map((preprint): Preprint => pipe(
    preprint.fullReviews,
    RA.map((review) => ({ createdAt: O.some(review.createdAt), doi: review.doi })),
    RA.map(sequenceS(O.option)),
    RA.compact,
    (fullReviews) => ({ handle: preprint.handle, fullReviews }),
  )),
);

const toReviews = (preprint: Preprint): ReadonlyArray<Review> => pipe(
  preprint.fullReviews,
  RA.map(({ doi, createdAt }) => ({ date: createdAt, articleDoi: preprint.handle, reviewId: doi })),
);

void pipe(
  TE.tryCatch(
    async () => axios.get<unknown>(
      'https://www.prereview.org/api/v2/preprints',
      { headers: { Accept: 'application/json' } },
    ),
    String,
  ),
  TE.map((response) => response.data),
  TE.chainEitherK(flow(
    preReviewResponse.decode,
    E.mapLeft((errors) => PR.failure(errors).join('\n')),
  )),
  TE.map(flow(
    ({ data }) => data,
    RA.map(toPreprint),
    RA.compact,
    RA.chain(toReviews),
    RA.map(({ date, articleDoi, reviewId }) => `${date.toISOString()},${articleDoi.value},${ReviewId.toString(reviewId)}`),
  )),
  TE.bimap(
    (error) => process.stderr.write(error),
    (reviews) => {
      process.stdout.write('Date,Article DOI,Review ID\n');
      process.stdout.write(reviews.join('\n'));
      process.stdout.write('\n');
    },
  ),
  TE.fold(
    () => process.exit(1),
    () => process.exit(0),
  ),
)();
