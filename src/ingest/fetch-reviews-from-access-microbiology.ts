import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe, flow } from 'fp-ts/function';
import * as t from 'io-ts';
import { FetchEvaluations } from './update-all';

const crossrefResponseCodec = t.strict({
  message: t.strict({
    items: t.readonlyArray(
      t.unknown,
    ),
  }),
});

export const fetchReviewsFromAccessMicrobiology: FetchEvaluations = (dependencies) => pipe(
  'https://api.crossref.org/works?filter=prefix:10.1099,type:peer-review,relation.type:is-review-of',
  dependencies.fetchData,
  TE.chainEitherK(flow(
    crossrefResponseCodec.decode,
    E.mapLeft(() => 'acmi: could not decode crossref response'),
  )),
  TE.map(() => ({
    evaluations: [],
    skippedItems: [],
  })),
);
