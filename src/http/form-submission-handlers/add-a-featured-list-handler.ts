import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { Middleware } from 'koa';
import { decodeFormSubmission, Dependencies as DecodeFormSubmissionDependencies } from './decode-form-submission';
import { ensureUserIsLoggedIn, Dependencies as EnsureUserIsLoggedInDependencies } from './ensure-user-is-logged-in';
import { GroupId } from '../../types/group-id';
import { UserId } from '../../types/user-id';
import { promoteListCommandCodec } from '../../write-side/commands';
import { DependenciesForCommands } from '../../write-side/dependencies-for-commands';
import { executeResourceAction } from '../../write-side/resources/execute-resource-action';
import * as listPromotion from '../../write-side/resources/list-promotion';
import { sendDefaultErrorHtmlResponse } from '../send-default-error-html-response';

const formBodyCodec = t.intersection([
  promoteListCommandCodec,
  t.strict({
    successRedirectPath: tt.NonEmptyString,
  }),
]);

const groupAdmins: Record<UserId, string> = {
  ['auth0|650a91161c07d3acf5ff7da5' as UserId]: 'd6e1a913-76f8-40dc-9074-8eac033e1bc8',
  ['twitter|1384541806231175172' as UserId]: '4bbf0c12-629b-4bb8-91d6-974f4df8efb2',
  ['auth0|65faae8fd0f034a2c4c72b7c' as UserId]: '10360d97-bf52-4aef-b2fa-2f60d319edd7',
  ['twitter|1443469693621309444' as UserId]: 'b5f31635-d32b-4df9-92a5-0325a1524343',
  ['twitter|380816062' as UserId]: 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0',
};

const isUserAdminOfThisGroup = (userId: UserId, groupId: GroupId) => (
  groupAdmins[userId] === groupId
);

type Dependencies = EnsureUserIsLoggedInDependencies
& DecodeFormSubmissionDependencies & DependenciesForCommands;

export const addAFeaturedListHandler = (dependencies: Dependencies): Middleware => async (context) => {
  const loggedInUser = ensureUserIsLoggedIn(dependencies, context, 'You must be logged in to feature a list.');
  if (O.isNone(loggedInUser)) {
    return;
  }
  const formBody = decodeFormSubmission(
    dependencies,
    context,
    formBodyCodec,
    loggedInUser.value.id,
  );
  if (E.isLeft(formBody)) {
    return;
  }
  if (isUserAdminOfThisGroup(loggedInUser.value.id, formBody.right.forGroup)) {
    const command = {
      forGroup: formBody.right.forGroup,
      listId: formBody.right.listId,
    };

    const commandResult = await pipe(
      command,
      executeResourceAction(dependencies, listPromotion.create),
    )();

    if (E.isRight(commandResult)) {
      context.redirect(formBody.right.successRedirectPath);
      return;
    }
  }
  sendDefaultErrorHtmlResponse(dependencies, context, StatusCodes.INTERNAL_SERVER_ERROR, 'An unexpected error occurred.');
};
