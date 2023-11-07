import * as TE from 'fp-ts/TaskEither';
import { ErrorPageBodyViewModel } from '../types/render-page-error';
import { HtmlPage } from '../types/html-page';

export type ConstructPage = (params: Record<string, unknown>) => TE.TaskEither<ErrorPageBodyViewModel, HtmlPage>;
