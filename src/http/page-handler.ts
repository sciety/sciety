import { Middleware } from '@koa/router';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as t from 'io-ts';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { UserIdFromString } from '../types/codecs/UserIdFromString';
import { userHandleCodec } from '../types/user-handle';
import { renderErrorPage } from './render-error-page';
import { standardPageLayout } from '../shared-components/standard-page-layout';
import * as DE from '../types/data-error';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';
import { User } from '../types/user';
import { GetUser } from '../shared-ports';
import { UserDetails } from '../types/user-details';

type ErrorToWebPage = (
  user: O.Option<User>
) => (
  error: RenderPageError
) => {
  body: string,
  status: StatusCodes.NOT_FOUND | StatusCodes.SERVICE_UNAVAILABLE,
};

export const toErrorResponse: ErrorToWebPage = (user) => (error) => pipe(
  renderErrorPage(error.message),
  (content) => ({
    title: 'Error',
    content,
  }),
  standardPageLayout(user),
  (body) => ({
    body,
    status: pipe(
      error.type,
      DE.fold({
        notFound: () => StatusCodes.NOT_FOUND,
        unavailable: () => StatusCodes.SERVICE_UNAVAILABLE,
      }),
    ),
  }),
);

const pageToSuccessResponse = (user: O.Option<User>, applyStandardPageLayout: boolean) => (page: Page) => ({
  body: (applyStandardPageLayout) ? standardPageLayout(user)(page) : page.content,
  status: StatusCodes.OK,
});

const toWebPage = (user: O.Option<User>, applyStandardPageLayout: boolean) => E.fold(
  toErrorResponse(user),
  pageToSuccessResponse(user, applyStandardPageLayout),
);

const passportUserCodec = t.type({
  id: UserIdFromString,
  handle: userHandleCodec,
  avatarUrl: t.string,
});

type Ports = {
  getUser: GetUser,
};

export const getLoggedInScietyUser = (adapters: Ports, input: unknown): O.Option<UserDetails> => pipe(
  input,
  passportUserCodec.decode,
  O.fromEither,
  O.chain(({ id }) => adapters.getUser(id)),
);

type HandlePage = (params: unknown) => TE.TaskEither<RenderPageError, Page>;

export const pageHandler = (
  adapters: Ports,
  handler: HandlePage,
  applyStandardPageLayout = true,
): Middleware => (
  async (context, next) => {
    const response = await pipe(
      {
        ...context.params,
        ...context.query,
        ...context.state,
      },
      handler,
      T.map(toWebPage(getLoggedInScietyUser(adapters, context.state.user), applyStandardPageLayout)),
    )();

    context.response.status = response.status;
    context.response.type = 'html';
    context.response.body = response.body;

    await next();
  }
);
