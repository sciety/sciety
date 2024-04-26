import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { Middleware } from 'koa';
import { decodeFormSubmission, Dependencies as DecodeFormSubmissionDependencies } from './decode-form-submission';
import { ensureUserIsLoggedIn, Dependencies as EnsureUserIsLoggedInDependencies } from './ensure-user-is-logged-in';
import { promoteListCommandCodec } from '../../write-side/commands';

type Dependencies = EnsureUserIsLoggedInDependencies
& DecodeFormSubmissionDependencies;

export const addAFeaturedListHandler = (dependencies: Dependencies): Middleware => async (context) => {
  const loggedInUser = ensureUserIsLoggedIn(dependencies, context, 'You must be logged in to feature a list.');
  if (O.isNone(loggedInUser)) {
    return;
  }

  if (E.isLeft(decodeFormSubmission(
    dependencies,
    context,
    promoteListCommandCodec,
    loggedInUser.value.id,
  ))) {
    return;
  }

  context.redirect('/groups/prereview');
};
