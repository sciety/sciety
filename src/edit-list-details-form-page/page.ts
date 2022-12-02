import * as TE from 'fp-ts/TaskEither';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const editListDetailsFormPage = (params: unknown): TE.TaskEither<RenderPageError, Page> => TE.right({ title: 'Edit details form', content: toHtmlFragment('<h1>My form</h1>') });
