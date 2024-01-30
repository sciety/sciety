import * as TE from 'fp-ts/TaskEither';
import { URL } from 'url';
import { ErrorPageBodyViewModel } from '../types/render-page-error';
import { HtmlPage } from './html-page';

export type ConstructPageResult = HtmlPage | URL;

export type ConstructPage = (
  params: Record<string, unknown>,
) => TE.TaskEither<ErrorPageBodyViewModel, ConstructPageResult>;
