import { Middleware } from '@koa/router';
import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { Maybe } from 'true-myth';
import { renderErrorPage } from './render-error-page';
import applyStandardPageLayout from '../shared-components/apply-standard-page-layout';
import { toHtmlFragment } from '../types/html-fragment';

enum Level {
  error,
  warn,
  info,
  debug,
}
type LevelName = keyof typeof Level;
type Payload = Record<string, unknown>;

type Logger = (level: LevelName, message: string, payload?: Payload) => void;

export const catchErrors = (logger: Logger, logMessage: string, pageMessage: string): Middleware => (
  async (context, next) => {
    try {
      await next();
    } catch (error: unknown) {
      logger('error', logMessage, { error });

      context.response.status = INTERNAL_SERVER_ERROR;
      context.response.body = applyStandardPageLayout({
        title: 'Error | Sciety',
        content: renderErrorPage(toHtmlFragment(pageMessage)),
      }, Maybe.nothing());
    }
  }
);
