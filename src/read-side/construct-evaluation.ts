import { URL } from 'url';
import { sequenceS } from 'fp-ts/Apply';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Queries } from '../read-models';
import { ExternalQueries } from '../third-parties';
import * as DE from '../types/data-error';
import { EvaluationLocator } from '../types/evaluation-locator';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';

type Dependencies = Queries & ExternalQueries;

type Evaluation = {
  fullText: SanitisedHtmlFragment,
  url: URL,
};

type ConstructEvaluation = (evaluationLocator: EvaluationLocator) => TE.TaskEither<DE.DataError, Evaluation>;

export const constructEvaluation = (
  dependencies: Dependencies,
): ConstructEvaluation => (evaluationLocator) => pipe(
  {
    fullText: pipe(
      evaluationLocator,
      dependencies.fetchEvaluationDigest,
      TE.map(({ fullText }) => fullText),
    ),
    url: dependencies.fetchEvaluationHumanReadableOriginalUrl(evaluationLocator),
  },
  sequenceS(TE.ApplySeq),
);
