import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../../domain-events';
import { DeleteListCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

export const deleteList: ResourceAction<DeleteListCommand> = (command) => () => pipe(
  [constructEvent('ListDeleted')(command)],
  E.right,
);
