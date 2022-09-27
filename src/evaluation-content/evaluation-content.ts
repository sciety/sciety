import { URL } from 'url';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as DE from '../types/data-error';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';
import * as RID from '../types/review-id';

type EvaluationContent = TE.TaskEither<RenderPageError, Page>;

export const paramsCodec = t.type({
  reviewid: RID.reviewIdCodec,
});

type FetchReview = (id: RID.ReviewId) => TE.TaskEither<DE.DataError, {
  fullText: HtmlFragment,
  url: URL,
}>;

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
