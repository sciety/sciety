import { ExpressionDoi } from '../types/expression-doi';

export const paperActivityPageRedirectPath = (expressionDoi: ExpressionDoi): string => `/articles/activity/${expressionDoi}`;

const isAllowedToContainSlashes = '.+';

export const paperActivityPagePathSpecification = `/articles/activity/:expressionDoi(${isAllowedToContainSlashes})`;
