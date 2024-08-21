/* eslint-disable @typescript-eslint/no-unused-vars */
import { DomainEvent, isEventOfType } from '../../domain-events';
import { EvaluationLocator, toEvaluationLocator } from '../../types/evaluation-locator';
import { ExpressionDoi } from '../../types/expression-doi';
import * as EDOI from '../../types/expression-doi';
import { GroupId } from '../../types/group-id';

export type PendingEvaluation = {
  expressionDoi: ExpressionDoi,
  evaluationLocator: EvaluationLocator,
};

type ReadModel = Array<PendingEvaluation>;

export const initialState = (): ReadModel => [];

export const handleEvent = (
  consideredGroupIds: ReadonlyArray<GroupId>,
) => (readModel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEventOfType('EvaluationPublicationRecorded')(event)) {
    readModel.push({
      expressionDoi: event.articleId,
      evaluationLocator: event.evaluationLocator,
    });
  }
  return readModel;
};

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
