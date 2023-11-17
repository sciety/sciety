import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { toHtmlFragment } from '../types/html-fragment.js';
import { HtmlPage } from '../html-pages/html-page.js';
import { ErrorPageBodyViewModel } from '../types/render-page-error.js';
import { FetchReview } from '../shared-ports/index.js';
import { Params } from './params.js';

type EvaluationContent = TE.TaskEither<ErrorPageBodyViewModel, HtmlPage>;

type Ports = {
  fetchReview: FetchReview,
};

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
