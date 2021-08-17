import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as tt from 'io-ts-types';
import { Middleware, ParameterizedContext } from 'koa';
import { User } from '../types/user';

type State = {
  user?: User,
};

export const targetFragmentIdField = 'targetFragmentId';

export const constructRedirectUrl = (context: ParameterizedContext): string => pipe(
  {
    referer: pipe(
      context.request.headers.referer,
      O.fromNullable,
      O.getOrElse(() => '/'),
    ),
    fragmentId: pipe(
      context.request.body[targetFragmentIdField],
      tt.NonEmptyString.decode,
      E.fold(
        () => '',
        (fragment) => `#${fragment}`,
      ),
    ),
  },
  (({ referer, fragmentId }) => `${referer}${fragmentId}`),
);

export const requireAuthentication: Middleware<State> = async (context, next) => {
  if (!(context.state.user)) {
    context.session.successRedirect = constructRedirectUrl(context);
    context.redirect('/log-in');
    return;
  }

  await next();
};

// ts-unused-exports:disable-next-line
export const annotateWithTwitterSuccess = (url: string): string => {
  const param = 'login_success=twitter';
  if (url.includes(param)) {
    return url;
  }
  const joinChar = url.indexOf('?') > -1 ? '&' : '?';
  return `${url}${joinChar}${param}`;
};

export const redirectAfterAuthenticating = (): Middleware => (
  async (context, next) => {
    const successRedirect = context.session.successRedirect || '/';
    context.redirect(annotateWithTwitterSuccess(successRedirect));
    delete context.session.successRedirect;

    await next();
  }
);
