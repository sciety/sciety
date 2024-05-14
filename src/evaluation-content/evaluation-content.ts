import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Params } from './params';
import { Queries } from '../read-models';
import { constructEvaluation } from '../read-side/construct-evaluation';
import { HtmlPage, toHtmlPage } from '../read-side/html-pages/html-page';
import { ExternalQueries } from '../third-parties';
import { ErrorPageBodyViewModel, toErrorPageBodyViewModel } from '../types/error-page-body-view-model';
import { toHtmlFragment } from '../types/html-fragment';

type EvaluationContent = TE.TaskEither<ErrorPageBodyViewModel, HtmlPage>;

type Dependencies = ExternalQueries & Queries;

export const evaluationContent = (dependencies: Dependencies) => (params: Params): EvaluationContent => pipe(
  params.reviewid,
  constructEvaluation(dependencies),
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
