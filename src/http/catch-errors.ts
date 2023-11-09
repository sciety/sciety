import { Middleware } from '@koa/router';
import { StatusCodes } from 'http-status-codes';
import { sendErrorHtmlResponse, Dependencies as SendErrorHtmlResponseDependencies } from './send-error-html-response';
import { Logger } from '../shared-ports';

type Dependencies = SendErrorHtmlResponseDependencies & { logger: Logger };

export const catchErrors = (dependencies: Dependencies, logMessage: string, pageMessage: string): Middleware => (
  async (context, next) => {
    try {
      await next();
    } catch (error: unknown) {
      dependencies.logger('error', logMessage, { error });

      sendErrorHtmlResponse(dependencies, context, StatusCodes.INTERNAL_SERVER_ERROR, pageMessage);
    }
  }
);
