import * as O from 'fp-ts/Option';
import * as PR from 'io-ts/PathReporter';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Middleware, ParameterizedContext } from 'koa';
import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as t from 'io-ts';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserPorts } from '../authentication-and-logging-in-of-sciety-users.js';
import { Queries } from '../../read-models/index.js';
import { UserId } from '../../types/user-id.js';
import { HtmlPage } from '../../html-pages/html-page.js';
import { handleCreateAnnotationCommand, Dependencies as HandleCreateAnnotationCommandDependencies } from './handle-create-annotation-command.js';
import { annotateArticleInListCommandCodec } from '../../write-side/commands/index.js';
import { createAnnotationFormPage, paramsCodec } from '../../html-pages/create-annotation-form-page/index.js';
import { ExternalQueries } from '../../third-parties/index.js';
import { standardPageLayout } from '../../shared-components/standard-page-layout.js';
import { UserDetails } from '../../types/user-details.js';
import { constructHtmlResponse } from '../../html-pages/construct-html-response.js';
import { toHtmlFragment } from '../../types/html-fragment.js';
import { sendHtmlResponse } from '../send-html-response.js';
import { GroupId } from '../../types/group-id.js';
import { sendDefaultErrorHtmlResponse, Dependencies as SendErrorHtmlResponseDependencies } from '../send-default-error-html-response.js';
import { detectClientClassification } from '../detect-client-classification.js';
import { inputFieldNames } from '../../standards/input-field-names.js';

type Dependencies = Queries &
GetLoggedInScietyUserPorts &
HandleCreateAnnotationCommandDependencies &
ExternalQueries &
SendErrorHtmlResponseDependencies;

const isUserAllowedToCreateAnnotation = (userId: UserId, listOwnerId: UserId | GroupId) => userId === listOwnerId;

type Params = t.TypeOf<typeof paramsCodec>;

const prependErrorToTitleForAccessibility = (formPage: HtmlPage) => ({
  title: `Error: ${formPage.title}`,
  content: formPage.content,
});

const redisplayFormPage = (
  dependencies: Dependencies,
  context: ParameterizedContext,
  params: Params,
  user: O.Option<UserDetails>,
) => pipe(
  createAnnotationFormPage(dependencies)(params, 'article-not-in-list'),
  TE.map(prependErrorToTitleForAccessibility),
  TE.mapLeft(
    (renderPageError) => ({
      type: renderPageError.type,
      message: toHtmlFragment(`Something went wrong when you submitted your annotation. ${renderPageError.message}`),
    }),
  ),
  T.map(constructHtmlResponse(user, standardPageLayout, detectClientClassification(context))),
);

type CreateAnnotationHandler = (dependencies: Dependencies) => Middleware;

export const createAnnotationHandler: CreateAnnotationHandler = (dependencies) => async (context) => {
  const loggedInUser = getLoggedInScietyUser(dependencies, context);
  if (O.isNone(loggedInUser)) {
    sendDefaultErrorHtmlResponse(dependencies, context, StatusCodes.FORBIDDEN, 'You must be logged in to annotate a list.');
    return;
  }
  const command = annotateArticleInListCommandCodec.decode(context.request.body);
  if (E.isLeft(command)) {
    dependencies.logger(
      'error',
      'Failed to decode the create annotation form',
      {
        codecDecodingError: PR.failure(command.left),
        requestBody: context.request.body,
        loggedInUserId: loggedInUser.value.id,
      },
    );
    sendDefaultErrorHtmlResponse(dependencies, context, StatusCodes.BAD_REQUEST, 'Cannot understand the command.');
    return;
  }

  const listOwner = pipe(
    command.right.listId,
    dependencies.lookupList,
    O.chainNullableK((list) => list.ownerId.value),
  );

  if (O.isNone(listOwner)) {
    sendDefaultErrorHtmlResponse(dependencies, context, StatusCodes.BAD_REQUEST, 'List on which you are trying to comment does not exist.');
    return;
  }

  if (!isUserAllowedToCreateAnnotation(loggedInUser.value.id, listOwner.value)) {
    sendDefaultErrorHtmlResponse(dependencies, context, StatusCodes.FORBIDDEN, 'Only the list owner is allowed to annotate their list.');
    return;
  }

  const commandResult = await handleCreateAnnotationCommand(dependencies)(context.request.body)();

  if (E.isRight(commandResult)) {
    if (commandResult.right === 'events-created') {
      context.redirect(`/lists/${command.right.listId}?${inputFieldNames.success}=true`);
      return;
    }
    context.redirect(`/lists/${command.right.listId}`);
    return;
  }
  const htmlResponse = await redisplayFormPage(
    dependencies,
    context,
    { listId: command.right.listId, articleId: command.right.articleId },
    loggedInUser,
  )();
  sendHtmlResponse(htmlResponse, context);
};
