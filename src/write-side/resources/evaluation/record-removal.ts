import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';

import { ResourceAction } from '../resource-action';
import { RecordEvaluationRemovalCommand } from '../../commands';

export const recordRemoval: ResourceAction<RecordEvaluationRemovalCommand> = () => () => pipe(
  E.right([]),
);
