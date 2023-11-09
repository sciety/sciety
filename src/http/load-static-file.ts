import path from 'path';
import { Middleware } from '@koa/router';
import { StatusCodes } from 'http-status-codes';
import send from 'koa-send';
import { toErrorHtmlDocument } from '../html-pages/to-error-html-document';
import { Logger } from '../infrastructure';
import { detectClientClassification } from './detect-client-classification';

type KoaSendError = {
  status: number,
};

const isKoaSendError = (variableToCheck: unknown): variableToCheck is KoaSendError => (
  (variableToCheck as KoaSendError).status !== undefined
);

export const loadStaticFile = (logger: Logger): Middleware => async (context) => {
  let pageMessage = 'Something went wrong, please try again.';
  const file = context.params.file.replace('editorial-communities', 'groups');
  const staticFolder = path.resolve(__dirname, '../../static');
  try {
    await send(context, file, { root: staticFolder });
  } catch (error: unknown) {
    if (isKoaSendError(error) && error.status === 404) {
      logger('warn', 'Static file not found', { error });
      pageMessage = 'File not found';
      context.response.status = 404;
    } else {
      logger('error', 'Static file could not be read', { error });
      context.response.status = StatusCodes.INTERNAL_SERVER_ERROR;
    }
    context.response.body = toErrorHtmlDocument(pageMessage, detectClientClassification(context));
  }
};
