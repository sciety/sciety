import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Middleware } from 'koa';
import { Payload } from '../../infrastructure/logger';
import { CreateList, Logger } from '../../shared-ports';
import * as LID from '../../types/list-id';
import * as LOID from '../../types/list-owner-id';
import { CreateListCommand } from '../../write-side/commands';
import { getLoggedInScietyUser, Dependencies as GetLoggedInScietyUserDependencies } from '../authentication-and-logging-in-of-sciety-users';

type Dependencies = GetLoggedInScietyUserDependencies & {
  logger: Logger,
  createList: CreateList,
};

export const createListHandler = (dependencies: Dependencies): Middleware => async (context) => {
  await pipe(
    getLoggedInScietyUser(dependencies, context),
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
      dependencies.createList,
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
        dependencies.logger('error', error.message, error.payload);
        context.redirect('back');
      },
      (listId) => {
        context.redirect(`/lists/${listId}/edit-details`);
      },
    ),
  )();
};
