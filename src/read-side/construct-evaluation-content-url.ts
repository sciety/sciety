import { URL } from 'url';
import * as EL from '../types/evaluation-locator';

const webContentBase = new URL('https://sciety.org/');

export const constructEvaluationContentUrl = (evaluationLocator: EL.EvaluationLocator): URL => new URL(
  `./evaluations/${EL.serialize(evaluationLocator)}/content`,
  webContentBase,
);
