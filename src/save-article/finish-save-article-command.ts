import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { Middleware } from 'koa';
import { articleSaveState } from './article-save-state';
import { commandHandler } from './command-handler';
import { articleAddedToList } from '../domain-events';
import { CommitEvents, GetAllEvents, SelectAllListsOwnedBy } from '../shared-ports';
import { CommandResult } from '../types/command-result';
import * as Doi from '../types/doi';
import * as LOID from '../types/list-owner-id';
import { User } from '../types/user';
import { UserId } from '../types/user-id';

const isCommand = (command: string): command is 'save-article' => command === 'save-article';

type Ports = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
};

type HandleWithSaveArticleCommand = (
  getAllEvents: GetAllEvents, user: User, articleId: Doi.Doi, commitEvents: CommitEvents) => T.Task<CommandResult>;

const handleWithSaveArticleCommand: HandleWithSaveArticleCommand = (
  getAllEvents, user, articleId, commitEvents,
) => pipe(
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
);

type HandleWithAddArticleToListCommand = (
  commitEvents: CommitEvents,
  userId: UserId,
  articleId: Doi.Doi,
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
) => T.Task<CommandResult>;

const handleWithAddArticleToListCommand: HandleWithAddArticleToListCommand = (
  commitEvents,
  userId,
  articleId,
  selectAllListsOwnedBy,
) => pipe(
  userId,
  LOID.fromUserId,
  selectAllListsOwnedBy,
  RA.head,
  O.map((list) => articleAddedToList(articleId, list.listId)),
  RA.fromOption,
  commitEvents,
);

export const finishSaveArticleCommand = (
  { getAllEvents, commitEvents, selectAllListsOwnedBy }: Ports,
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
        process.env.EXPERIMENT_ENABLED === 'true'
          ? handleWithAddArticleToListCommand(commitEvents, user.id, articleId, selectAllListsOwnedBy)
          : handleWithSaveArticleCommand(getAllEvents, user, articleId, commitEvents),
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
