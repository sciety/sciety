import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Page } from '../../types/page';
import { RenderPageError } from '../../types/render-page-error';
import { renderAsHtml } from './render-as-html';
import { constructViewModel } from './construct-view-model';
import { Doi } from '../../types/doi';

type SaveArticleFormPage = TE.TaskEither<RenderPageError, Page>;

export const saveArticleFormPage = (): SaveArticleFormPage => pipe(
  {
    articleId: new Doi('10.1101/123456'),

  },
  constructViewModel,
  renderAsHtml,
  TE.right,
);
