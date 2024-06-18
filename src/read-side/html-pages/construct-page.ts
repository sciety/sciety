import * as TE from 'fp-ts/TaskEither';
import { ErrorPageViewModel } from './construct-error-page-view-model';
import { HtmlPage } from './html-page';
import { RedirectTarget } from './redirect-target';
import { UserId } from '../../types/user-id';

export type ConstructPage = (
  params: Record<string, unknown>,
) => TE.TaskEither<ErrorPageViewModel | RedirectTarget, HtmlPage>;

export type ConstructLoggedInPage = (
  userId: UserId,
  params: Record<string, unknown>,
) => TE.TaskEither<ErrorPageViewModel | RedirectTarget, HtmlPage>;
