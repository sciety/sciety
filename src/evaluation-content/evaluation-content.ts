import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Params } from './params';
import { HtmlPage, toHtmlPage } from '../read-side/html-pages/html-page';
import { ExternalQueries } from '../third-parties';
import { ErrorPageBodyViewModel, toErrorPageBodyViewModel } from '../types/error-page-body-view-model';
import { toHtmlFragment } from '../types/html-fragment';

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
