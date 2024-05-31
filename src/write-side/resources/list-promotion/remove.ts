import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../../domain-events';
import { RemoveListPromotionCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const remove: ResourceAction<RemoveListPromotionCommand> = (command) => (events) => pipe(
  [constructEvent('ListPromotionRemoved')({
    byGroup: command.forGroup,
    listId: command.listId,
  })],
  E.right,
);
