import * as E from 'fp-ts/Either';
import { ResourceAction } from '../resource-action';
import { UpdateEvaluationCommand } from '../../commands';

export const update: ResourceAction<UpdateEvaluationCommand> = () => () => E.right([]);
