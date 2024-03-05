import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { Evaluation } from './evaluation';
import { Group } from '../../types/group';
import * as EDOI from '../../types/expression-doi';

export type DocmapViewModel = {
  expressionDoi: EDOI.ExpressionDoi,
  group: Group,
  evaluations: RNEA.ReadonlyNonEmptyArray<Evaluation>,
  updatedAt: Date,
};
