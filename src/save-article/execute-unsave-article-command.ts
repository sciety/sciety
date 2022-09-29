import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { Middleware } from 'koa';
import { articleSaveState } from './article-save-state';
import { commandHandler } from './command-handler';
import {
  DomainEvent,
} from '../domain-events';
import { CommitEvents } from '../shared-ports';
import { DoiFromString } from '../types/codecs/DoiFromString';
import { userCodec } from '../types/user';

type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
  commitEvents: CommitEvents,
};

export const articleIdFieldName = 'articleid';

const contextCodec = t.type({
  state: t.type({
    user: userCodec,
  }),
  request: t.type({
    body: t.type({
      [articleIdFieldName]: DoiFromString,
    }),
  }),
});

export const unsaveArticle = (
  { getAllEvents, commitEvents }: Ports,
): Middleware => async (context, next) => {
  const middlewareSucceeded = await pipe(
    context,
    contextCodec.decode,
    E.map((ctx) => ({
      user: ctx.state.user,
      articleId: ctx.request.body[articleIdFieldName],
    })),
    TE.fromEither,
    TE.chainTaskK(({ user, articleId }) => pipe(
      getAllEvents,
      T.chain(flow(
        articleSaveState(user.id, articleId),
        commandHandler({
          articleId,
          userId: user.id,
          type: 'UnsaveArticle' as const,
        }),
        commitEvents,
      )),
    )),
    TE.match(
      () => false,
      () => true,
    ),
  )();

  if (middlewareSucceeded) {
    await next();
  } else {
    throw new Error('no articleId passed to unsaveArticle');
  }
};
