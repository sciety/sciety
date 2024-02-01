import { ExpressionDoi } from '../types/expression-doi';

const basePath = '/articles/activity/';

export const paperActivityPageRedirectPath = (expressionDoi: ExpressionDoi): string => `${basePath}${expressionDoi}`;

const isAllowedToContainSlashes = '.+';

export const paperActivityPagePathSpecification = `${basePath}:expressionDoi(${isAllowedToContainSlashes})`;
