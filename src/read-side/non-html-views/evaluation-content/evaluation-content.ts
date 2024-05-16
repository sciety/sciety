import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { paramsCodec } from './params';
import { Queries } from '../../../read-models';
import { ExternalQueries } from '../../../third-parties';
import { toHtmlFragment } from '../../../types/html-fragment';
import { NonHtmlViewError } from '../non-html-view-error';
import { NonHtmlViewParams } from '../non-html-view-params';
import { NonHtmlViewRepresentation, toNonHtmlViewRepresentation } from '../non-html-view-representation';

type EvaluationContent = TE.TaskEither<NonHtmlViewError, NonHtmlViewRepresentation>;

type Dependencies = ExternalQueries & Queries;

export const evaluationContent = (dependencies: Dependencies) => (params: NonHtmlViewParams): EvaluationContent => pipe(
  params,
  paramsCodec.decode,
  TE.fromEither,
  TE.chainW(({ reviewid }) => dependencies.fetchEvaluationDigest(reviewid)),
  TE.bimap(
    () => ({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: toHtmlFragment('Could not fetch evaluation'),
    }),
    (digest) => toNonHtmlViewRepresentation(toHtmlFragment(digest)),
  ),
);
