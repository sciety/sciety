import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { paramsCodec } from './params';
import { Queries } from '../../../read-models';
import { ExternalQueries } from '../../../third-parties';
import { toHtmlFragment } from '../../../types/html-fragment';
import { NonHtmlViewError, toNonHtmlViewError } from '../non-html-view-error';
import { NonHtmlViewParams } from '../non-html-view-params';
import { NonHtmlViewRepresentation, toNonHtmlViewRepresentation } from '../non-html-view-representation';

type EvaluationContent = TE.TaskEither<NonHtmlViewError, NonHtmlViewRepresentation>;

type Dependencies = ExternalQueries & Queries;

export const evaluationContent = (dependencies: Dependencies) => (params: NonHtmlViewParams): EvaluationContent => pipe(
  params,
  paramsCodec.decode,
  TE.fromEither,
  TE.chainW(({ evaluationLocator }) => dependencies.fetchEvaluationDigest(evaluationLocator)),
  TE.bimap(
    () => toNonHtmlViewError('Could not fetch evaluation'),
    (digest) => toNonHtmlViewRepresentation(toHtmlFragment(digest), 'text/html'),
  ),
);
