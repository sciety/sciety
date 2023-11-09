import * as O from 'fp-ts/Option';
import * as PR from 'io-ts/PathReporter';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';
import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as t from 'io-ts';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserPorts } from '../authentication-and-logging-in-of-sciety-users';
import { Queries } from '../../read-models';
import { UserId } from '../../types/user-id';
import { HtmlPage } from '../../html-pages/html-page';
import { handleCreateAnnotationCommand, Dependencies as HandleCreateAnnotationCommandDependencies } from './handle-create-annotation-command';
import { annotateArticleInListCommandCodec } from '../../write-side/commands';
import { createAnnotationFormPage, paramsCodec } from '../../html-pages/create-annotation-form-page';
import { ExternalQueries } from '../../third-parties';
import { standardPageLayout } from '../../shared-components/standard-page-layout';
import { UserDetails } from '../../types/user-details';
import { constructHtmlResponse } from '../../html-pages/construct-html-response';
import { toHtmlFragment } from '../../types/html-fragment';
import { setResponseOnContext } from '../set-response-on-context';
import { GroupId } from '../../types/group-id';
import { sendErrorHtmlResponse } from '../send-error-html-response';

type Dependencies = Queries & GetLoggedInScietyUserPorts & HandleCreateAnnotationCommandDependencies & ExternalQueries;

const isUserAllowedToCreateAnnotation = (userId: UserId, listOwnerId: UserId | GroupId) => userId === listOwnerId;

type Params = t.TypeOf<typeof paramsCodec>;

const prependErrorToTitleForAccessibility = (formPage: HtmlPage) => ({
  title: `Error: ${formPage.title}`,
  content: formPage.content,
});

const redisplayFormPage = (
  dependencies: Dependencies,
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
  T.map(constructHtmlResponse(user, standardPageLayout)),
);

type CreateAnnotationHandler = (adapters: Dependencies) => Middleware;

export const createAnnotationHandler: CreateAnnotationHandler = (adapters) => async (context) => {
  const loggedInUser = getLoggedInScietyUser(adapters, context);
  if (O.isNone(loggedInUser)) {
    sendErrorHtmlResponse(context, StatusCodes.FORBIDDEN, 'You must be logged in to annotate a list.');
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
    sendErrorHtmlResponse(context, StatusCodes.BAD_REQUEST, 'Cannot understand the command.');
    return;
  }

  await pipe(
    command.right.listId,
    adapters.lookupList,
    O.chainNullableK((list) => list.ownerId.value),
    O.filter((listOwnerId) => isUserAllowedToCreateAnnotation(loggedInUser.value.id, listOwnerId)),
    O.match(
      async () => {
        sendErrorHtmlResponse(context, StatusCodes.FORBIDDEN, 'Only the list owner is allowed to annotate their list.');
      },
      async () => {
        const commandResult = await handleCreateAnnotationCommand(adapters)(context.request.body)();
        if (E.isRight(commandResult)) {
          context.redirect(`/lists/${command.right.listId}`);
          return;
        }
        const htmlResponse = await redisplayFormPage(
          adapters,
          { listId: command.right.listId, articleId: command.right.articleId },
          loggedInUser,
        )();
        setResponseOnContext(htmlResponse, context);
      },
    ),
  );
};
