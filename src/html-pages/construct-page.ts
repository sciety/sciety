import * as TE from 'fp-ts/TaskEither';
import { ErrorPageBodyViewModel } from '../types/render-page-error';
import { HtmlPage } from './html-page';

export type RedirectTarget = string;

export type ConstructPageResult = HtmlPage | RedirectTarget;

export type ConstructPage = (
  params: Record<string, unknown>,
) => TE.TaskEither<ErrorPageBodyViewModel, ConstructPageResult>;
