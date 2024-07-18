import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import * as t from 'io-ts';
import { Middleware, ParameterizedContext } from 'koa';
import {
  decodeFormSubmission,
} from './decode-form-submission';
import { ensureUserIsLoggedIn } from './ensure-user-is-logged-in';
import { DependenciesForViews } from '../../read-side/dependencies-for-views';
import { toErrorPageViewModel } from '../../read-side/html-pages/construct-error-page-view-model';
import { constructHtmlResponse } from '../../read-side/html-pages/construct-html-response';
import { createAnnotationFormPage, paramsCodec } from '../../read-side/html-pages/create-annotation-form-page';
import { HtmlPage, toHtmlPage } from '../../read-side/html-pages/html-page';
import { standardPageLayout } from '../../read-side/html-pages/shared-components/standard-page-layout';
import { inputFieldNames } from '../../standards';
import { GroupId } from '../../types/group-id';
import { toHtmlFragment } from '../../types/html-fragment';
import { UserDetails } from '../../types/user-details';
import { UserId } from '../../types/user-id';
import { DependenciesForCommands } from '../../write-side';
import { AnnotateArticleInListCommand, annotateArticleInListCommandCodec } from '../../write-side/commands';
import { executeResourceAction } from '../../write-side/resources/execute-resource-action';
import * as listResource from '../../write-side/resources/list';
import { detectClientClassification } from '../detect-client-classification';
import { sendDefaultErrorHtmlResponse } from '../send-default-error-html-response';
import { sendHtmlResponse } from '../send-html-response';

type Dependencies = DependenciesForViews & DependenciesForCommands;

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
  createAnnotationFormPage(dependencies, 'article-not-in-list')(params),
  TE.map(prependErrorToTitleForAccessibility),
  TE.mapLeft(
    (errorPageBodyViewModel) => toErrorPageViewModel({
      type: errorPageBodyViewModel.type,
      message: toHtmlFragment(`Something went wrong when you submitted your annotation. ${errorPageBodyViewModel.message}`),
    }),
  ),
  T.map(constructHtmlResponse(user, standardPageLayout, detectClientClassification(context))),
);

type CreateAnnotationHandler = (dependencies: Dependencies) => Middleware;

export const createAnnotationHandler: CreateAnnotationHandler = (dependencies) => async (context) => {
  const loggedInUser = pipe(
    ensureUserIsLoggedIn(dependencies, context, 'You must be logged in to annotate a list.'),
    O.chain((id) => dependencies.lookupUser(id)),
  );
  if (O.isNone(loggedInUser)) {
    return;
  }
  const command: E.Either<unknown, AnnotateArticleInListCommand> = decodeFormSubmission(
    dependencies,
    context,
    annotateArticleInListCommandCodec,
    loggedInUser.value.id,
  );
  if (E.isLeft(command)) {
    return;
  }

  const listOwner = pipe(
    command.right.listId,
    dependencies.lookupList,
    O.chainNullableK((list) => list.ownerId.value),
  );

  if (O.isNone(listOwner)) {
    sendDefaultErrorHtmlResponse(dependencies, context, StatusCodes.BAD_REQUEST, 'You tried to comment on a list that does not exist.');
    return;
  }

  if (!isUserAllowedToCreateAnnotation(loggedInUser.value.id, listOwner.value)) {
    sendDefaultErrorHtmlResponse(dependencies, context, StatusCodes.FORBIDDEN, 'Only the list owner is allowed to annotate their list.');
    return;
  }

  const commandResult = await pipe(
    command.right,
    executeResourceAction(dependencies, listResource.annotate),
  )();

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
