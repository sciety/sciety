import path from 'path';
import { Middleware } from '@koa/router';
import { StatusCodes } from 'http-status-codes';
import send from 'koa-send';
import { Logger } from '../infrastructure';
import { sendErrorHtmlResponse } from './send-error-html-response';

type KoaSendError = {
  status: number,
};

const isKoaSendError = (variableToCheck: unknown): variableToCheck is KoaSendError => (
  (variableToCheck as KoaSendError).status !== undefined
);

export const loadStaticFile = (logger: Logger): Middleware => async (context) => {
  let pageMessage = 'Something went wrong, please try again.';
  let errorStatus: StatusCodes;
  const file = context.params.file.replace('editorial-communities', 'groups');
  const staticFolder = path.resolve(__dirname, '../../static');
  try {
    await send(context, file, { root: staticFolder });
  } catch (error: unknown) {
    if (isKoaSendError(error) && error.status === 404) {
      logger('warn', 'Static file not found', { error });
      pageMessage = 'File not found';
      errorStatus = 404;
    } else {
      logger('error', 'Static file could not be read', { error });
      errorStatus = StatusCodes.INTERNAL_SERVER_ERROR;
    }
    sendErrorHtmlResponse(context, errorStatus, pageMessage);
  }
};
