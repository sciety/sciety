import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { Middleware } from 'koa';

export const articleIdFieldName = 'articleid';

const bodyCodec = t.type({
  [articleIdFieldName]: t.string,
});

export const saveSaveArticleCommand: Middleware = async (context, next) => {
  const middlewareSucceeded = pipe(
    context.request.body,
    bodyCodec.decode,
    E.map((body) => body),
    E.match(
      () => false,
      (body) => {
        context.session.command = 'save-article';
        context.session.articleId = body[articleIdFieldName];
        return true;
      },
    ),
  );

  if (middlewareSucceeded) { await next(); }
};
