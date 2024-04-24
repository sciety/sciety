import * as E from 'fp-ts/Either';
import { constructEvent } from '../../../domain-events';
import { PromoteListCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const create: ResourceAction<PromoteListCommand> = (command) => (events) => E.right([constructEvent('ListPromotionCreated')({
  listId: command.listId,
  byGroup: command.forGroup,
})]);
