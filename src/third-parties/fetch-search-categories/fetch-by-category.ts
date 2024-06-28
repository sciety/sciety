import * as EDOI from '../../types/expression-doi';
import { ExpressionDoi } from '../../types/expression-doi';

export const fetchByCategory = (): ReadonlyArray<ExpressionDoi> => [
  EDOI.fromValidatedString('10.1101/2024.01.16.575490'),
];
