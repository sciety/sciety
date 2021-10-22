import path from 'path';
import { Middleware } from '@koa/router';
import * as O from 'fp-ts/Option';
import { StatusCodes } from 'http-status-codes';
import send from 'koa-send';
import { renderErrorPage } from './render-error-page';
import { Logger } from '../infrastructure';
import { standardPageLayout } from '../shared-components/standard-page-layout';
import { toHtmlFragment } from '../types/html-fragment';

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
    context.response.body = standardPageLayout(O.none)({
      title: 'Error',
      content: renderErrorPage(toHtmlFragment(pageMessage)),
    });
  }
};
