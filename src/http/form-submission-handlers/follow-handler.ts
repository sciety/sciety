import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import * as t from 'io-ts';
import { Middleware } from 'koa';
import { decodeFormSubmission } from './decode-form-submission';
import { Queries } from '../../read-models';
import { Logger } from '../../shared-ports';
import * as DE from '../../types/data-error';
import * as GroupId from '../../types/group-id';
import { GroupIdFromStringCodec } from '../../types/group-id';
import { follow } from '../../write-side/command-handlers/follow-command-handler';
import { DependenciesForCommands } from '../../write-side/dependencies-for-commands';
import { executeResourceAction } from '../../write-side/resources/execute-resource-action';
import { getAuthenticatedUserIdFromContext } from '../authentication-and-logging-in-of-sciety-users';
import { sendDefaultErrorHtmlResponse, Dependencies as SendErrorHtmlResponseDependencies } from '../send-default-error-html-response';

export const groupProperty = 'groupid';

type Dependencies = DependenciesForCommands & SendErrorHtmlResponseDependencies & {
  logger: Logger,
  getGroup: Queries['getGroup'],
};

const validate = (dependencies: Dependencies) => (groupId: GroupId.GroupId) => pipe(
  dependencies.getGroup(groupId),
  E.fromOption(() => DE.notFound),
  E.map((group) => ({
    groupId: group.id,
  })),
);

const formBodyCodec = t.type({
  [groupProperty]: GroupIdFromStringCodec,
});

export const followHandler = (dependencies: Dependencies): Middleware => async (context) => {
  const loggedInUserId = getAuthenticatedUserIdFromContext(context);
  if (O.isNone(loggedInUserId)) {
    context.redirect('/log-in');
    return;
  }
  const formBody = decodeFormSubmission(
    dependencies,
    context,
    formBodyCodec,
    loggedInUserId.value,
  );
  if (E.isLeft(formBody)) {
    return;
  }

  await pipe(
    formBody.right[groupProperty],
    validate(dependencies),
    TE.fromEither,
    TE.fold(
      () => {
        dependencies.logger('error', 'Problem with /follow', { error: StatusCodes.BAD_REQUEST });
        sendDefaultErrorHtmlResponse(dependencies, context, StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong; we\'re looking into it.');
        return T.of(undefined);
      },
      (params) => {
        context.redirect('back');
        return pipe(
          {
            userId: loggedInUserId.value,
            groupId: params.groupId,
          },
          executeResourceAction(dependencies, follow),
        );
      },
    ),
  )();
};
