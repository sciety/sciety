import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';

import { ResourceAction } from '../resource-action';
import { toErrorMessage } from '../../../types/error-message';
import { RecordEvaluationRemovalCommand } from '../../commands';

export const recordRemoval: ResourceAction<RecordEvaluationRemovalCommand> = () => () => pipe(
  E.left(toErrorMessage('not implemented')),
);
