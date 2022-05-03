import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { Middleware } from 'koa';
import { articleSaveState } from './article-save-state';
import { commandHandler } from './command-handler';
import {
  UserSavedArticleEvent, UserUnsavedArticleEvent,
} from '../domain-events';
import { GetAllEvents } from '../shared-ports';
import { CommandResult } from '../types/command-result';
import * as Doi from '../types/doi';
import { User } from '../types/user';

const isCommand = (command: string): command is 'save-article' => command === 'save-article';

type Ports = {
  getAllEvents: GetAllEvents,
  commitEvents: (events: ReadonlyArray<UserSavedArticleEvent | UserUnsavedArticleEvent>) => T.Task<CommandResult>,
};

export const finishSaveArticleCommand = (
  { getAllEvents, commitEvents }: Ports,
): Middleware => async (context, next) => {
  const user = context.state.user as User;
  await pipe(
    {
      articleId: pipe(context.session.articleId, Doi.fromString),
      command: pipe(context.session.command, O.fromNullable, O.filter(isCommand)),
    },
    sequenceS(O.Apply),
    O.fold(
      () => T.of(undefined),
      ({ articleId }) => pipe(
        getAllEvents,
        T.chain(flow(
          articleSaveState(user.id, articleId),
          commandHandler({
            articleId,
            userId: user.id,
            type: 'SaveArticle' as const,
          }),
          commitEvents,
        )),
        T.map(() => {
          delete context.session.command;
          delete context.session.articleId;
          return undefined;
        }),
      ),
    ),
  )();

  await next();
};
