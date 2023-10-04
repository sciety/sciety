import * as TE from 'fp-ts/TaskEither';
import { RenderPageError } from '../types/render-page-error';
import { HtmlPage } from '../types/html-page';

export type ConstructPage = (params: Record<string, unknown>) => TE.TaskEither<RenderPageError, HtmlPage>;
