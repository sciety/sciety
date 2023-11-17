import * as TE from 'fp-ts/TaskEither';
import { ErrorPageBodyViewModel } from '../types/render-page-error.js';
import { HtmlPage } from './html-page.js';

export type ConstructPage = (params: Record<string, unknown>) => TE.TaskEither<ErrorPageBodyViewModel, HtmlPage>;
