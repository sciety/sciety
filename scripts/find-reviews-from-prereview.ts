import axios from 'axios';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import * as PR from 'io-ts/PathReporter';
import { Doi } from '../src/types/doi';
import { ReviewId } from '../src/types/review-id';

const preReviewResponse = t.type({
  data: t.readonlyArray(t.type({
    handle: t.string,
    fullReviews: t.readonlyArray(t.type({
      createdAt: t.string,
      doi: tt.optionFromNullable(t.string),
    })),
  })),
});

type Review = {
  date: Date,
  articleDoi: Doi,
  reviewId: ReviewId,
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
  )),
  TE.bimap(
    (error) => process.stderr.write(error),
    (reviews) => process.stdout.write(JSON.stringify(reviews, undefined, 2)),
  ),
  TE.fold(
    () => process.exit(1),
    () => process.exit(0),
  ),
)();
