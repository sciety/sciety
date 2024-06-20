import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructViewModel } from './construct-view-model/construct-view-model';
import { renderAsHtml } from './render-as-html/render-as-html';
import { ErrorPageViewModel } from '../construct-error-page-view-model';
import { HtmlPage } from '../html-page';

export const searchPage: TE.TaskEither<ErrorPageViewModel, HtmlPage> = pipe(
  constructViewModel(),
  renderAsHtml,
  TE.right,
);
