import * as O from 'fp-ts/Option';
import * as PR from 'io-ts/PathReporter';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Middleware, ParameterizedContext } from 'koa';
import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as t from 'io-ts';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserPorts } from '../authentication-and-logging-in-of-sciety-users';
import { Queries } from '../../read-models';
import { UserId } from '../../types/user-id';
import { HtmlPage, toHtmlPage } from '../../html-pages/html-page';
import { handleCreateAnnotationCommand, Dependencies as HandleCreateAnnotationCommandDependencies } from './handle-create-annotation-command';
import { annotateArticleInListCommandCodec } from '../../write-side/commands';
import { createAnnotationFormPage, paramsCodec } from '../../html-pages/create-annotation-form-page';
import { ExternalQueries } from '../../third-parties';
import { standardPageLayout } from '../../shared-components/standard-page-layout';
import { UserDetails } from '../../types/user-details';
import { constructHtmlResponse } from '../../html-pages/construct-html-response';
import { toHtmlFragment } from '../../types/html-fragment';
import { sendHtmlResponse } from '../send-html-response';
import { GroupId } from '../../types/group-id';
import { sendDefaultErrorHtmlResponse, Dependencies as SendErrorHtmlResponseDependencies } from '../send-default-error-html-response';
import { detectClientClassification } from '../detect-client-classification';
import { inputFieldNames } from '../../standards';
import { toErrorPageBodyViewModel } from '../../types/error-page-body-view-model';

type Dependencies = Queries &
GetLoggedInScietyUserPorts &
HandleCreateAnnotationCommandDependencies &
ExternalQueries &
SendErrorHtmlResponseDependencies;

const isUserAllowedToCreateAnnotation = (userId: UserId, listOwnerId: UserId | GroupId) => userId === listOwnerId;

type Params = t.TypeOf<typeof paramsCodec>;

const prependErrorToTitleForAccessibility = (formPage: HtmlPage) => toHtmlPage({
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
    (errorPageBodyViewModel) => toErrorPageBodyViewModel({
      type: errorPageBodyViewModel.type,
      message: toHtmlFragment(`Something went wrong when you submitted your annotation. ${errorPageBodyViewModel.message}`),
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
  sendHtmlResponse(context)(htmlResponse);
};
