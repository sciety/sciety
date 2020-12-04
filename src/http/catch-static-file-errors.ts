import { Middleware } from '@koa/router';
import * as O from 'fp-ts/lib/Option';
import { isHttpError } from 'http-errors';
import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { renderErrorPage } from './render-error-page';
import applyStandardPageLayout from '../shared-components/apply-standard-page-layout';
import { toHtmlFragment } from '../types/html-fragment';

type Logger = (level: 'error', message: string, payload: Record<string, unknown>) => void;

export const catchStaticFileErrors = (logger: Logger): Middleware => async (context, next) => {
  try {
    await next();
  } catch (error: unknown) {
    logger('error', 'Static file could not be read', { error });
    let pageMessage = 'Something went wrong, please try again.';
    if (isHttpError(error) && error.status === 404) {
      pageMessage = 'File not found';
      context.response.status = 404;
    } else {
      context.response.status = INTERNAL_SERVER_ERROR;
    }
    context.response.body = applyStandardPageLayout({
      title: 'Error | Sciety',
      content: renderErrorPage(toHtmlFragment(pageMessage)),
    }, O.none);
  }
};
