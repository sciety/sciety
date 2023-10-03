import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Page } from '../../types/page';
import { RenderPageError } from '../../types/render-page-error';
import { renderAsHtml } from './render-as-html';
import { constructViewModel } from './construct-view-model';

type SaveArticleFormPage = TE.TaskEither<RenderPageError, Page>;

export const saveArticleFormPage = (): SaveArticleFormPage => pipe(
  constructViewModel(),
  renderAsHtml,
  TE.right,
);
