import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { Action } from './action';
import * as EDOI from '../../../../types/expression-doi';
import { Group } from '../../../../types/group';

export type DocmapViewModel = {
  expressionDoi: EDOI.ExpressionDoi,
  group: Group,
  actions: RNEA.ReadonlyNonEmptyArray<Action>,
  updatedAt: Date,
};
