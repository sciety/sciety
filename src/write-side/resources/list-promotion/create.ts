import * as E from 'fp-ts/Either';
import { toErrorMessage } from '../../../types/error-message';
import { PromoteListCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const create: ResourceAction<PromoteListCommand> = (command) => (events) => E.left(toErrorMessage('not yet implemented'));
