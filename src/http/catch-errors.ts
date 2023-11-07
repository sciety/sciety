import { Middleware } from '@koa/router';
import { StatusCodes } from 'http-status-codes';
import { toErrorHtmlDocument } from '../html-pages/to-error-html-document';

type Logger = (level: 'error', message: string, payload: Record<string, unknown>) => void;

export const catchErrors = (logger: Logger, logMessage: string, pageMessage: string): Middleware => (
  async (context, next) => {
    try {
      await next();
    } catch (error: unknown) {
      logger('error', logMessage, { error });

      context.response.status = StatusCodes.INTERNAL_SERVER_ERROR;
      context.response.body = toErrorHtmlDocument(pageMessage);
    }
  }
);
