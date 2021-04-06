import { Middleware } from '@koa/router';
import * as O from 'fp-ts/Option';
import { StatusCodes } from 'http-status-codes';
import { renderErrorPage } from './render-error-page';
import { applyStandardPageLayout } from '../shared-components';
import { toHtmlFragment } from '../types/html-fragment';

type Logger = (level: 'error', message: string, payload: Record<string, unknown>) => void;

export const catchErrors = (logger: Logger, logMessage: string, pageMessage: string): Middleware => (
  async (context, next) => {
    try {
      await next();
    } catch (error: unknown) {
      logger('error', logMessage, { error });

      context.response.status = StatusCodes.INTERNAL_SERVER_ERROR;
      context.response.body = applyStandardPageLayout(O.none)({
        title: 'Error',
        content: renderErrorPage(toHtmlFragment(pageMessage)),
      });
    }
  }
);
