import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Middleware } from 'koa';
import { Payload } from '../../infrastructure/logger/index.js';
import { Logger } from '../../infrastructure/index.js';
import { getLoggedInScietyUser } from '../authentication-and-logging-in-of-sciety-users.js';
import { CreateListCommand } from '../../write-side/commands/index.js';
import * as LID from '../../types/list-id.js';
import * as LOID from '../../types/list-owner-id.js';
import { CommandHandlers } from '../../write-side/command-handlers/index.js';
import { Queries } from '../../read-models/index.js';

type Ports = Queries & CommandHandlers & { logger: Logger };

export const createListHandler = (adapters: Ports): Middleware => async (context) => {
  await pipe(
    getLoggedInScietyUser(adapters, context),
    O.map((userDetails) => userDetails.id),
    E.fromOption(() => ({
      message: 'No authenticated user',
      payload: { formBody: context.request.body },
      errorType: 'codec-failed' as const,
    })),
    TE.fromEither,
    TE.map((userId): CreateListCommand => ({
      listId: LID.generate(),
      ownerId: LOID.fromUserId(userId),
      name: 'Untitled',
      description: '',
    })),
    TE.chainW((command) => pipe(
      command,
      adapters.createList,
      TE.bimap(
        (errorMessage) => ({
          message: 'Command handler failed',
          payload: {
            errorMessage,
          },
        }),
        () => command.listId,
      ),
    )),
    TE.match(
      (error: { errorType?: string, message: string, payload: Payload }) => {
        adapters.logger('error', error.message, error.payload);
        context.redirect('back');
      },
      (listId) => {
        context.redirect(`/lists/${listId}/edit-details`);
      },
    ),
  )();
};
