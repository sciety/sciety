import * as E from 'fp-ts/Either';
import { constructEvent } from '../../../domain-events';
import { DeleteListCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const deleteList: ResourceAction<DeleteListCommand> = (command) => (events) => E.right([
  constructEvent('ListDeleted')(command),
]);
