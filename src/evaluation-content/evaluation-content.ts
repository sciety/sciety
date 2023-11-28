import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { toHtmlFragment } from '../types/html-fragment';
import { HtmlPage } from '../html-pages/html-page';
import { ErrorPageBodyViewModel } from '../types/render-page-error';
import { Params } from './params';
import { ExternalQueries } from '../third-parties';

type EvaluationContent = TE.TaskEither<ErrorPageBodyViewModel, HtmlPage>;

type Ports = {
  fetchReview: ExternalQueries['fetchReview'],
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
