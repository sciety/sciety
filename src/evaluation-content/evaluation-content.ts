import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { toHtmlFragment } from '../types/html-fragment';
import { HtmlPage } from '../types/html-page';
import { RenderPageError } from '../types/render-page-error';
import * as EL from '../types/evaluation-locator';
import { FetchReview } from '../shared-ports';

type EvaluationContent = TE.TaskEither<RenderPageError, HtmlPage>;

export const paramsCodec = t.type({
  reviewid: EL.evaluationLocatorCodec,
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
