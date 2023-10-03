import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Doi } from '../../types/doi';
import { Page } from '../../types/page';
import { RenderPageError } from '../../types/render-page-error';
import { renderAsHtml } from './render-as-html';

const doi = new Doi('10.1101/123456');

type SaveArticleFormPage = TE.TaskEither<RenderPageError, Page>;

export const saveArticleFormPage = (): SaveArticleFormPage => pipe(
  {
    articleId: doi,
  },
  renderAsHtml,
  TE.right,
);
