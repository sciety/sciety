import * as E from 'fp-ts/Either';
import { AssignUserAsGroupAdminCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const create: ResourceAction<AssignUserAsGroupAdminCommand> = (command) => (events) => E.right([]);
