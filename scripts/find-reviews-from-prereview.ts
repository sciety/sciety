import axios from 'axios';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import * as PR from 'io-ts/PathReporter';
import { DoiFromString } from '../src/types/codecs/DoiFromString';
import { Doi } from '../src/types/doi';
import * as ReviewId from '../src/types/review-id';

const preReviewResponse = t.type({
  data: t.readonlyArray(t.type({
    handle: t.union([DoiFromString, t.string]),
    fullReviews: t.readonlyArray(t.type({
      createdAt: tt.DateFromISOString,
      doi: tt.optionFromNullable(DoiFromString),
    })),
  })),
});

type Review = {
  date: Date,
  articleDoi: Doi,
  reviewId: ReviewId.ReviewId,
};

const toReview = (): Review => ({
  date: new Date(),
  articleDoi: new Doi('10.1101/380238'),
  reviewId: new Doi('10.5281/zenodo.3662409'),
});

void pipe(
  TE.tryCatch(
    async () => axios.get<unknown>(
      'https://www.prereview.org/api/v2/preprints?limit=10',
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
    RA.map(toReview),
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
