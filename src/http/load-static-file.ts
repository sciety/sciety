import path from 'path';
import { Middleware } from '@koa/router';
import { StatusCodes } from 'http-status-codes';
import send from 'koa-send';
import { sendDefaultErrorHtmlResponse, Dependencies as SendErrorHtmlResponseDependencies } from './send-default-error-html-response';
import { Logger } from '../infrastructure-contract';

type KoaSendError = {
  status: number,
};

const isKoaSendError = (variableToCheck: unknown): variableToCheck is KoaSendError => (
  (variableToCheck as KoaSendError).status !== undefined
);

type Dependencies = SendErrorHtmlResponseDependencies & { logger: Logger };

export const loadStaticFile = (dependencies: Dependencies): Middleware => async (context) => {
  let pageMessage = 'Something went wrong, please try again.';
  let errorStatus: StatusCodes;
  const file = context.params.file.replace('editorial-communities', 'groups');
  const staticFolder = path.resolve(__dirname, '../../static');
  try {
    await send(context, file, { root: staticFolder });
  } catch (error: unknown) {
    if (isKoaSendError(error) && error.status === 404) {
      dependencies.logger('warn', 'Static file not found', { error });
      pageMessage = 'File not found';
      errorStatus = 404;
    } else {
      dependencies.logger('error', 'Static file could not be read', { error });
      errorStatus = StatusCodes.INTERNAL_SERVER_ERROR;
    }
    sendDefaultErrorHtmlResponse(dependencies, context, errorStatus, pageMessage);
  }
};
