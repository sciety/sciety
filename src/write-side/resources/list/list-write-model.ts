import { ExpressionDoi } from '../../../types/expression-doi';

export type ListWriteModel = {
  expressions: Array<{ expressionDoi: ExpressionDoi, annotated: boolean }>,
  name: string,
  description: string,
};
