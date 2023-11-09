import { Middleware } from '@koa/router';
import { StatusCodes } from 'http-status-codes';
import { sendErrorHtmlResponse } from './send-error-html-response';

type Logger = (level: 'error', message: string, payload: Record<string, unknown>) => void;

export const catchErrors = (logger: Logger, logMessage: string, pageMessage: string): Middleware => (
  async (context, next) => {
    try {
      await next();
    } catch (error: unknown) {
      logger('error', logMessage, { error });

      sendErrorHtmlResponse(context, StatusCodes.INTERNAL_SERVER_ERROR, pageMessage);
    }
  }
);
