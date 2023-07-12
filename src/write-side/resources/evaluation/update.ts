import * as E from 'fp-ts/Either';
import { ResourceAction } from '../resource-action';
import { UpdateEvaluationCommand } from '../../commands';
import { constructEvent } from '../../../domain-events';

export const update: ResourceAction<UpdateEvaluationCommand> = (command) => () => E.right([
  constructEvent('EvaluationUpdated')({
    evaluationLocator: command.evaluationLocator,
    evaluationType: command.evaluationType,
  }),
]);
