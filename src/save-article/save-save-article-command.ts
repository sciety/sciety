import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { DefaultContext, Middleware } from 'koa';

export const articleIdFieldName = 'articleid';

const bodyCodec = t.type({
  [articleIdFieldName]: t.string,
});

const appendToSession = (context: DefaultContext) => (payload: Record<string, unknown>) => {
  context.session = {
    ...context.session,
    ...payload,
  };
  return T.of(undefined);
};

export const saveSaveArticleCommand: Middleware = async (context, next) => {
  await pipe(
    context.request.body,
    bodyCodec.decode,
    TE.fromEither,
    TE.map((body) => ({
      articleId: body[articleIdFieldName],
      command: 'save-article',
    })),
    TE.chainTaskK(appendToSession(context)),
    TE.fold(
      (error) => {
        console.log('error: failed to store SaveArticleCommand on session', error);
        return T.of(undefined);
      },
      () => next,
    ),
  )();
};
