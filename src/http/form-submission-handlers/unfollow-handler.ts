import { Middleware } from '@koa/router';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { decodeFormSubmission } from './decode-form-submission';
import { ensureUserIsLoggedIn, Dependencies as EnsureUserIsLoggedInDependencies } from './ensure-user-is-logged-in';
import { Logger } from '../../logger';
import { inputFieldNames } from '../../standards';
import { GroupIdFromStringCodec } from '../../types/group-id';
import { DependenciesForCommands } from '../../write-side';
import { executeResourceAction } from '../../write-side/resources/execute-resource-action';
import * as groupFollowResource from '../../write-side/resources/group-follow';

type Dependencies = DependenciesForCommands & EnsureUserIsLoggedInDependencies & {
  logger: Logger,
};

const formBodyCodec = t.strict({
  [inputFieldNames.groupId]: GroupIdFromStringCodec,
});

export const unfollowHandler = (dependencies: Dependencies): Middleware => async (context) => {
  const loggedInUserId = ensureUserIsLoggedIn(dependencies, context, 'You must be logged in to unfollow a group.');
  if (O.isNone(loggedInUserId)) {
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

  const command = {
    userId: loggedInUserId.value,
    groupId: formBody.right[inputFieldNames.groupId],
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const commandResult = await pipe(
    command,
    executeResourceAction(dependencies, groupFollowResource.unfollow),
  )();
  context.redirect('back');
};
