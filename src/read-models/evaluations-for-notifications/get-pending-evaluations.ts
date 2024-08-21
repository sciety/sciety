/* eslint-disable @typescript-eslint/no-unused-vars */
import { DomainEvent } from '../../domain-events';
import { EvaluationLocator, toEvaluationLocator } from '../../types/evaluation-locator';
import { ExpressionDoi } from '../../types/expression-doi';
import * as EDOI from '../../types/expression-doi';

export type PendingEvaluation = {
  expressionDoi: ExpressionDoi,
  evaluationLocator: EvaluationLocator,
};

type ReadModel = unknown;

export const initialState = (): ReadModel => ({});

export const handleEvent = (readModel: ReadModel, event: DomainEvent): ReadModel => readModel;

export const getPendingEvaluations = (readModel: ReadModel) => (): ReadonlyArray<PendingEvaluation> => [
  {
    expressionDoi: EDOI.fromValidatedString('10.1101/2024.04.03.24305276'),
    evaluationLocator: toEvaluationLocator('doi:10.5281/zenodo.13274625'),
  },
  {
    expressionDoi: EDOI.fromValidatedString('10.1101/2024.04.03.24305276'),
    evaluationLocator: toEvaluationLocator('doi:10.5281/zenodo.12958884'),
  },
  {
    expressionDoi: EDOI.fromValidatedString('10.1101/2024.05.07.592993'),
    evaluationLocator: toEvaluationLocator('doi:10.5281/zenodo.11644732'),
  },
];
