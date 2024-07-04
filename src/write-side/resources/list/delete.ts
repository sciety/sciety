import * as E from 'fp-ts/Either';
import { toErrorMessage } from '../../../types/error-message';
import { DeleteListCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const deleteList: ResourceAction<DeleteListCommand> = (command) => (events) => E.left(toErrorMessage('not-implemented'));
