import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Middleware } from 'koa';
import { decodeFormSubmission, Dependencies as DecodeFormSubmissionDependencies } from './decode-form-submission';
import { ensureUserIsLoggedIn, Dependencies as EnsureUserIsLoggedInDependencies } from './ensure-user-is-logged-in';
import { promoteListCommandCodec } from '../../write-side/commands';
import { DependenciesForCommands } from '../../write-side/dependencies-for-commands';
import * as listPromotion from '../../write-side/resources/list-promotion';

type Dependencies = EnsureUserIsLoggedInDependencies
& DecodeFormSubmissionDependencies & DependenciesForCommands;

export const addAFeaturedListHandler = (dependencies: Dependencies): Middleware => async (context) => {
  const loggedInUser = ensureUserIsLoggedIn(dependencies, context, 'You must be logged in to feature a list.');
  if (O.isNone(loggedInUser)) {
    return;
  }
  const command = decodeFormSubmission(
    dependencies,
    context,
    promoteListCommandCodec,
    loggedInUser.value.id,
  );
  if (E.isLeft(command)) {
    return;
  }

  await pipe(
    dependencies.getAllEvents,
    T.map(listPromotion.create(command.right)),
    TE.chainW(dependencies.commitEvents),
  )();

  context.redirect('/groups/prereview');
};
