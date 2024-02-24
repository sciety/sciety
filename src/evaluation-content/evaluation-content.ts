import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { toHtmlFragment } from '../types/html-fragment.js';
import { HtmlPage, toHtmlPage } from '../html-pages/html-page.js';
import { ErrorPageBodyViewModel, toErrorPageBodyViewModel } from '../types/error-page-body-view-model.js';
import { Params } from './params.js';
import { ExternalQueries } from '../third-parties/index.js';

type EvaluationContent = TE.TaskEither<ErrorPageBodyViewModel, HtmlPage>;

export const evaluationContent = (dependencies: ExternalQueries) => (params: Params): EvaluationContent => pipe(
  params.reviewid,
  dependencies.fetchEvaluation,
  TE.bimap(
    (error) => toErrorPageBodyViewModel({
      type: error,
      message: toHtmlFragment('Could not fetch evaluation'),
    }),
    (review) => toHtmlPage({
      title: 'Evaluation',
      content: toHtmlFragment(review.fullText),
    }),
  ),
);
