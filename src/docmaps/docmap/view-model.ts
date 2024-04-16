import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { Evaluation } from './evaluation';
import * as EDOI from '../../types/expression-doi';
import { Group } from '../../types/group';

export type DocmapViewModel = {
  expressionDoi: EDOI.ExpressionDoi,
  group: Group,
  evaluations: RNEA.ReadonlyNonEmptyArray<Evaluation>,
  updatedAt: Date,
};
