import { URL } from 'url';
import * as EL from '../types/evaluation-locator';

const appOrigin = process.env.APP_ORIGIN ?? 'https://sciety.org';

export const evaluationContentPathSpecification = '/evaluations/:evaluationLocator(.+)/content';

export const constructEvaluationContentUrl = (evaluationLocator: EL.EvaluationLocator): URL => new URL(
  `${appOrigin}/evaluations/${EL.serialize(evaluationLocator)}/content`,
);
