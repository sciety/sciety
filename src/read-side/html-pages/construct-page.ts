import * as TE from 'fp-ts/TaskEither';
import { HtmlPage } from './html-page';
import { RedirectTarget } from './redirect-target';
import { ErrorPageBodyViewModel } from '../../types/error-page-body-view-model';
import { UserId } from '../../types/user-id';

export type ConstructPage = (
  params: Record<string, unknown>,
) => TE.TaskEither<ErrorPageBodyViewModel | RedirectTarget, HtmlPage>;

export type ConstructLoggedInPage = (
  userId: UserId,
  params: Record<string, unknown>,
) => TE.TaskEither<ErrorPageBodyViewModel | RedirectTarget, HtmlPage>;
