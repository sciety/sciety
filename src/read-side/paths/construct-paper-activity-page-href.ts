import { EvaluationLocator } from '../../types/evaluation-locator';
import { ExpressionDoi } from '../../types/expression-doi';

const basePath = '/articles/activity/';

export const constructPaperActivityPageHref = (expressionDoi: ExpressionDoi): string => `${basePath}${expressionDoi}`;

export const constructPaperActivityPageFocusedOnEvaluationHref = (
  expressionDoi: ExpressionDoi,
  evaluationLocator: EvaluationLocator,
): string => `${basePath}${expressionDoi}#${evaluationLocator}`;

const isAllowedToContainSlashes = '.+';

export const paperActivityPagePathSpecification = `${basePath}:expressionDoi(${isAllowedToContainSlashes})`;
