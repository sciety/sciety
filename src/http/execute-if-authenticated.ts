import { Middleware } from '@koa/router';
import * as O from 'fp-ts/Option';
import { StatusCodes } from 'http-status-codes';
import { renderErrorPage } from './render-error-page';
import { applyStandardPageLayout } from '../shared-components';
import { toHtmlFragment } from '../types/html-fragment';

type Logger = (level: 'error', message: string, payload: Record<string, unknown>) => void;

type Ports = {
  logger: Logger,
};

export const executeIfAuthenticated = (ports: Ports): Middleware => async (context, next) => {
  try {
    await next();
  } catch (error: unknown) {
    ports.logger('error', 'Problem with /follow', { error });

    context.response.status = StatusCodes.INTERNAL_SERVER_ERROR;
    context.response.body = applyStandardPageLayout(O.none)({
      title: 'Error',
      content: renderErrorPage(toHtmlFragment('Something went wrong; we\'re looking into it.')),
    });
  }
};
