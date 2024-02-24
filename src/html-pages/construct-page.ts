import * as TE from 'fp-ts/TaskEither';
import { ErrorPageBodyViewModel } from '../types/error-page-body-view-model.js';
import { HtmlPage } from './html-page.js';
import { RedirectTarget } from './redirect-target.js';

export type ConstructPage = (
  params: Record<string, unknown>,
) => TE.TaskEither<ErrorPageBodyViewModel | RedirectTarget, HtmlPage>;
