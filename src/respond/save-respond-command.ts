import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { DefaultContext, Middleware } from 'koa';
import { appendToSession } from '../save-article/save-save-article-command';

export const appendToState = (context: DefaultContext) => (payload: Record<string, unknown>): T.Task<void> => {
  context.state = {
    ...context.state,
    ...payload,
  };
  return T.of(undefined);
};

// this smells like it ought to be a command codec
const bodyCodec = t.type({
  command: t.string,
  reviewid: t.string,
});

export const saveRespondCommand: Middleware = async (context, next) => {
  await pipe(
    context.request.body,
    bodyCodec.decode,
    TE.fromEither,
    TE.map((body) => ({
      command: body.command,
      reviewId: body.reviewid,
    })),
    TE.chainFirstTaskK(appendToSession(context)),
    TE.map(({ reviewId }) => ({ targetFragmentId: reviewId })),
    TE.chainFirstTaskK(appendToState(context)),
    TE.fold(
      (error) => {
        console.log('error: failed to store RespondCommand on session and state', error);
        return T.of(undefined);
      },
      () => next,
    ),
  )();
};
