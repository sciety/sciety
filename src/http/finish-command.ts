import * as O from 'fp-ts/Option';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';
import { renderErrorPage } from './render-error-page';
import { finishFollowCommand, Ports as FinishFollowCommandPorts } from '../write-side/follow';
import { sessionGroupProperty } from '../write-side/follow/finish-follow-command';
import { standardPageLayout } from '../shared-components/standard-page-layout';
import { toHtmlFragment } from '../types/html-fragment';
import { Logger } from '../shared-ports';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserPorts } from './authentication-and-logging-in-of-sciety-users';

type Ports = FinishFollowCommandPorts & GetLoggedInScietyUserPorts & {
  logger: Logger,
};

export const finishCommand = (ports: Ports): Middleware => async (context, next) => {
  if (context.session.command === 'follow') {
    const user = getLoggedInScietyUser(ports, context);
    if (O.isNone(user)) {
      await next();
      return;
    }
    const result = await finishFollowCommand(ports)(context.session[sessionGroupProperty], user.value)();
    delete context.session.command;
    delete context.session[sessionGroupProperty];
    if (O.isNone(result)) {
      ports.logger('error', 'Could not finish command', { session: context.session });
      context.response.status = StatusCodes.INTERNAL_SERVER_ERROR;
      context.response.body = standardPageLayout(O.none)({
        title: 'Error',
        content: renderErrorPage(toHtmlFragment('Something went wrong, please try again.')),
      });
    } else {
      await next();
    }
  } else {
    await next();
  }
};
