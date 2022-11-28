import * as TE from 'fp-ts/TaskEither';
import { EditListDetailsCommand } from '../commands';
import { CommandHandler } from '../types/command-handler';
import { toErrorMessage } from '../types/error-message';

export const editListDetailsCommandHandler = (): CommandHandler<EditListDetailsCommand> => () => TE.left(toErrorMessage('not implemented'));
