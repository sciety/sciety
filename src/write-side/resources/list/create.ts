import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../../domain-events';
import { CreateListCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

export const create: ResourceAction<CreateListCommand> = (command) => () => pipe(
  [constructEvent('ListCreated')(command)],
  E.right,
);
