import * as TE from 'fp-ts/TaskEither';
import { RenderPageError } from '../types/render-page-error';
import { Page } from '../types/page';

export type ConstructPage = (params: Record<string, unknown>) => TE.TaskEither<RenderPageError, Page>;
