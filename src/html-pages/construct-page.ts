import * as TE from 'fp-ts/TaskEither';
import { ErrorPageBodyViewModel } from '../types/error-page-body-view-model';
import { HtmlPage } from './html-page';
import { RedirectTarget } from './redirect-target';

export type ConstructPage = (
  params: Record<string, unknown>,
) => TE.TaskEither<ErrorPageBodyViewModel | RedirectTarget, HtmlPage>;
