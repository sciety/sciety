import * as O from 'fp-ts/Option';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';
import { renderErrorPage } from './render-error-page';
import { finishFollowCommand, Ports as FinishFollowCommandPorts } from '../write-side/follow';
import { sessionGroupProperty } from '../write-side/follow/finish-follow-command';
import { standardPageLayout } from '../shared-components/standard-page-layout';
import { toHtmlFragment } from '../types/html-fragment';
import { Logger } from '../shared-ports';

type Ports = FinishFollowCommandPorts & {
  logger: Logger,
};

export const finishCommand = (ports: Ports): Middleware => async (context, next) => {
  if (context.session.command === 'follow') {
    const result = await finishFollowCommand(ports)(context.session[sessionGroupProperty], context.state.user)();
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
