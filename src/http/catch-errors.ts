import { Middleware } from '@koa/router';
import { StatusCodes } from 'http-status-codes';
import { sendDefaultErrorHtmlResponse, Dependencies as SendErrorHtmlResponseDependencies } from './send-default-error-html-response';
import { Logger } from '../logger';

type Dependencies = SendErrorHtmlResponseDependencies & { logger: Logger };

export const catchErrors = (dependencies: Dependencies, logMessage: string, pageMessage: string): Middleware => (
  async (context, next) => {
    try {
      await next();
    } catch (error: unknown) {
      dependencies.logger('error', logMessage, { error });

      sendDefaultErrorHtmlResponse(dependencies, context, StatusCodes.INTERNAL_SERVER_ERROR, pageMessage);
    }
  }
);
