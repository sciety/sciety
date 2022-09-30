import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { Middleware } from 'koa';

export const articleIdFieldName = 'articleid';

const bodyCodec = t.type({
  [articleIdFieldName]: t.string,
});

export const saveSaveArticleCommand: Middleware = async (context, next) => {
  await pipe(
    context.request.body,
    bodyCodec.decode,
    TE.fromEither,
    TE.map((body) => ({
      articleId: body[articleIdFieldName],
      command: 'save-article',
    })),
    TE.chainFirstTaskK((session) => {
      context.session = {
        ...context.session,
        ...session,
      };
      return T.of(undefined);
    }),
    TE.chainTaskK(() => next),
  )();
};
