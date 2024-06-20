import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { renderAsHtml } from './render-as-html/render-as-html';
import { ErrorPageViewModel } from '../construct-error-page-view-model';
import { HtmlPage } from '../html-page';

export const searchPage: TE.TaskEither<ErrorPageViewModel, HtmlPage> = pipe(
  renderAsHtml(),
  TE.right,
);
