import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { paramsCodec } from './params';
import { Queries } from '../../../read-models';
import { ExternalQueries } from '../../../third-parties';
import { ErrorPageBodyViewModel, toErrorPageBodyViewModel } from '../../../types/error-page-body-view-model';
import { toHtmlFragment } from '../../../types/html-fragment';
import { toNotFound } from '../../html-pages/create-page-from-params';
import { HtmlPage, toHtmlPage } from '../../html-pages/html-page';

type EvaluationContent = TE.TaskEither<ErrorPageBodyViewModel, HtmlPage>;

type Dependencies = ExternalQueries & Queries;

export const evaluationContent = (
  dependencies: Dependencies,
) => (
  input: Record<string, unknown>,
): EvaluationContent => pipe(
  input,
  paramsCodec.decode,
  E.mapLeft(toNotFound),
  E.map((params) => params.reviewid),
  TE.fromEither,
  TE.chain((evaluationLocator) => pipe(
    evaluationLocator,
    dependencies.fetchEvaluationDigest,
    TE.mapLeft(
      (error) => toErrorPageBodyViewModel({
        type: error,
        message: toHtmlFragment('Could not fetch evaluation'),
      }),
    ),
  )),
  TE.map(
    (digest) => toHtmlPage({
      title: 'Evaluation',
      content: toHtmlFragment(digest),
    }),
  ),
);
