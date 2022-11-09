import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as PR from 'io-ts/PathReporter';
import { Middleware } from 'koa';
import { removeArticleFromListCommandCodec } from '../commands/remove-article-from-list';
import { Logger } from '../shared-ports';

export const removeArticleFromListFromForm = (adapters: { logger: Logger }): Middleware => async (context, next) => {
  pipe(
    {
      articleId: context.request.body.articleid,
      listId: context.request.body.listid,
    },
    removeArticleFromListCommandCodec.decode,
    E.bimap(
      (errors) => pipe(
        errors,
        PR.failure,
        (fails) => adapters.logger('error', 'invalid remove article from list form command', { fails }),
      ),
      (command) => adapters.logger('info', 'received remove article from list form command', { command }),
    ),
  );
  await next();
};
