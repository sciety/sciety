import * as TE from 'fp-ts/TaskEither';
import { Page } from '../../types/page';
import { RenderPageError } from '../../types/render-page-error';
import { renderAsHtml } from './render-as-html';

type SaveArticleFormPage = TE.TaskEither<RenderPageError, Page>;

export const saveArticleFormPage = (): SaveArticleFormPage => TE.right(renderAsHtml());
