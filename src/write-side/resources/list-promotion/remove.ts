import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { RemoveListPromotionCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const remove: ResourceAction<RemoveListPromotionCommand> = (command) => (events) => pipe(
  [],
  E.right,
);
