import * as O from 'fp-ts/Option';
import * as PR from 'io-ts/PathReporter';
import { identity, pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import * as t from 'io-ts';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserPorts } from '../authentication-and-logging-in-of-sciety-users';
import { Queries } from '../../read-models';
import { UserId } from '../../types/user-id';
import { GroupId } from '../../types/group-id';
import { handleCreateAnnotationCommand, Dependencies as HandleCreateAnnotationCommandDependencies } from './handle-create-annotation-command';
import { annotateArticleInListCommandCodec } from '../../write-side/commands';
import { createAnnotationFormPage, paramsCodec } from '../../html-pages/create-annotation-form-page';
import { ExternalQueries } from '../../third-parties';
import { standardPageLayout } from '../../shared-components/standard-page-layout';
import { UserDetails } from '../../types/user-details';

type Dependencies = Queries & GetLoggedInScietyUserPorts & HandleCreateAnnotationCommandDependencies & ExternalQueries;

const scietyAdminUserId = 'auth0|650d543de75a96413ce859b1' as UserId;

const isUserAllowedToCreateAnnotation = (
  userId: UserId,
  listOwnerId: UserId | GroupId,
) => userId === listOwnerId || userId === scietyAdminUserId;

type Params = t.TypeOf<typeof paramsCodec>;

const redisplayFormPage = (
  dependencies: Dependencies,
  params: Params,
  user: O.Option<UserDetails>,
) => pipe(
  createAnnotationFormPage(dependencies)(params, 'article-not-in-list'),
  TE.map((formPage) => ({
    title: `Error: ${formPage.title}`,
    content: formPage.content,
  })),
  TE.map(standardPageLayout(user)),
  TE.match(
    (renderPageError) => `Something went wrong when you submitted your annotation. ${renderPageError.message}`,
    identity,
  ),
);

type CreateAnnotationHandler = (adapters: Dependencies) => Middleware;

export const createAnnotationHandler: CreateAnnotationHandler = (adapters) => async (context) => {
  const loggedInUser = getLoggedInScietyUser(adapters, context);
  if (O.isNone(loggedInUser)) {
    context.response.status = StatusCodes.FORBIDDEN;
    context.response.body = 'You must be logged in to annotate a list.';
    return;
  }
  const command = annotateArticleInListCommandCodec.decode(context.request.body);
  if (E.isLeft(command)) {
    adapters.logger(
      'error',
      'Failed to decode the create annotation form',
      {
        codecDecodingError: PR.failure(command.left),
        requestBody: context.request.body,
        loggedInUserId: loggedInUser.value.id,
      },
    );
    context.response.status = StatusCodes.BAD_REQUEST;
    context.response.body = 'Cannot understand the command.';
    return;
  }

  await pipe(
    command.right.listId,
    adapters.lookupList,
    O.chainNullableK((list) => list.ownerId.value),
    O.filter((listOwnerId) => isUserAllowedToCreateAnnotation(loggedInUser.value.id, listOwnerId)),
    O.match(
      async () => {
        context.response.status = StatusCodes.FORBIDDEN;
        context.response.body = 'Only the list owner is allowed to annotate their list.';
      },
      async () => {
        const commandResult = await handleCreateAnnotationCommand(adapters)(context.request.body)();
        if (E.isRight(commandResult)) {
          context.redirect(`/lists/${command.right.listId}`);
          return;
        }
        context.response.status = StatusCodes.BAD_REQUEST;
        context.response.type = 'html';
        context.response.body = await redisplayFormPage(
          adapters,
          { listId: command.right.listId, articleId: command.right.articleId },
          loggedInUser,
        )();
      },
    ),
  );
};
