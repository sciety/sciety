import { Middleware } from '@koa/router';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { decodeFormSubmission } from './decode-form-submission';
import { ensureUserIsLoggedIn, Dependencies as EnsureUserIsLoggedInDependencies } from './ensure-user-is-logged-in';
import { Logger } from '../../logger';
import { GroupIdFromStringCodec } from '../../types/group-id';
import { DependenciesForCommands } from '../../write-side';
import { unfollowCommandHandler } from '../../write-side/command-handlers';

type Dependencies = DependenciesForCommands & EnsureUserIsLoggedInDependencies & {
  logger: Logger,
};

const formBodyCodec = t.strict({
  editorialcommunityid: GroupIdFromStringCodec,
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

  await pipe(
    {
      userId: loggedInUserId.value,
      groupId: formBody.right.editorialcommunityid,
    },
    unfollowCommandHandler(dependencies),
  )();
  context.redirect('back');
};
