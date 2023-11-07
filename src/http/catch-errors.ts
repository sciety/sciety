import { Middleware } from '@koa/router';
import * as O from 'fp-ts/Option';
import { StatusCodes } from 'http-status-codes';
import { renderOopsMessage } from '../html-pages/render-oops-message';
import { standardPageLayout } from '../shared-components/standard-page-layout';
import { toHtmlFragment } from '../types/html-fragment';

type Logger = (level: 'error', message: string, payload: Record<string, unknown>) => void;

export const catchErrors = (logger: Logger, logMessage: string, pageMessage: string): Middleware => (
  async (context, next) => {
    try {
      await next();
    } catch (error: unknown) {
      logger('error', logMessage, { error });

      context.response.status = StatusCodes.INTERNAL_SERVER_ERROR;
      context.response.body = standardPageLayout(O.none)({
        title: 'Error',
        content: renderOopsMessage(toHtmlFragment(pageMessage)),
      });
    }
  }
);
