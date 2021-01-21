import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';
import { Middleware } from 'koa';

const validateCommand = O.fromPredicate((command): boolean => (
  command === 'save-article'
));

export const finishSaveArticleCommand = (): Middleware => async (context, next) => {
  await pipe(
    context.session.command,
    O.fromNullable,
    O.chain(validateCommand),
    O.fold(
      () => T.of(undefined),
      () => T.of(undefined),
    ),
  )();

  await next();
};
