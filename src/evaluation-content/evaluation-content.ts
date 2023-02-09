import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';
import * as RID from '../types/review-id';
import { FetchReview } from '../shared-ports';

type EvaluationContent = TE.TaskEither<RenderPageError, Page>;

export const paramsCodec = t.type({
  reviewid: RID.reviewIdCodec,
});

type Ports = {
  fetchReview: FetchReview,
};

type Params = t.TypeOf<typeof paramsCodec>;

export const evaluationContent = (adapters: Ports) => (params: Params): EvaluationContent => pipe(
  params.reviewid,
  adapters.fetchReview,
  TE.bimap(
    (error) => ({
      type: error,
      message: toHtmlFragment('Could not fetch evaluation'),
    }),
    (review) => ({
      title: 'Evaluation',
      content: toHtmlFragment(review.fullText),
    }),
  ),
);
