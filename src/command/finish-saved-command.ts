import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { Middleware } from 'koa';
import { encodedCommandFieldName } from './save-command';
import { RuntimeGeneratedEvent } from '../domain-events';
import { commandHandler } from '../respond/command-handler';
import { generateEvents, Ports as SavedArticlePorts } from '../save-article';
import { Command, CommandFromString } from '../types/command';
import { User } from '../types/user';

type Ports = SavedArticlePorts & {
  commitEvents: (events: ReadonlyArray<RuntimeGeneratedEvent>) => T.Task<void>,
};

const dispatchCommand = (ports: Ports) => (user: User) => (command: Command) => {
  switch (command.type) {
    case 'UnsaveArticle':
    case 'SaveArticle':
      return generateEvents(ports)(user, command);
    case 'respond-helpful':
    case 'respond-not-helpful':
    case 'revoke-response':
      return commandHandler(ports)(user, command);
  }
};

export const finishSavedCommand = (
  ports: Ports,
): Middleware => async (context, next) => {
  const user = context.state.user as User;
  await pipe(
    context.session[encodedCommandFieldName],
    CommandFromString.decode,
    E.fold(
      () => T.of(undefined),
      flow(
        dispatchCommand(ports)(user),
        T.chain(ports.commitEvents),
        T.map(() => {
          delete context.session[encodedCommandFieldName];
          return undefined;
        }),
      ),
    ),
  )();

  context.redirect('back');
  await next();
};
