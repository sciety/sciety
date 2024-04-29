import * as TE from 'fp-ts/TaskEither';
import { HtmlPage } from './html-page';
import { RedirectTarget } from './redirect-target';
import { ErrorPageBodyViewModel } from '../../types/error-page-body-view-model';

export type ConstructPage = (
  params: Record<string, unknown>,
) => TE.TaskEither<ErrorPageBodyViewModel | RedirectTarget, HtmlPage>;
