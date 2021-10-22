import path from 'path';
import { Middleware } from '@koa/router';
import * as O from 'fp-ts/Option';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from 'koa';
import send from 'koa-send';
import { renderErrorPage } from './render-error-page';
import { standardPageLayout } from '../shared-components/standard-page-layout';
import { toHtmlFragment } from '../types/html-fragment';

type Logger = (level: 'error', message: string, payload: Record<string, unknown>) => void;

export const loadStaticFile = (logger: Logger): Middleware => async (context) => {
  const file = context.params.file.replace('editorial-communities', 'groups');
  const staticFolder = path.resolve(__dirname, '../../static');
  try {
    await send(context, file, { root: staticFolder });
  } catch (error: unknown) {
    logger('error', 'Static file could not be read', { error });
    let pageMessage = 'Something went wrong, please try again.';
    if (error instanceof HttpError && error.status === 404) {
      pageMessage = 'File not found';
      context.response.status = 404;
    } else {
      context.response.status = StatusCodes.INTERNAL_SERVER_ERROR;
    }
    context.response.body = standardPageLayout(O.none)({
      title: 'Error',
      content: renderErrorPage(toHtmlFragment(pageMessage)),
    });
  }
};
