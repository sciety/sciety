import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructViewModel, Dependencies } from './construct-view-model/construct-view-model';
import { HtmlPage } from '../../types/html-page';
import { RenderPageError } from '../../types/render-page-error';
import { renderAsHtml } from './render-as-html/render-as-html';

type ListsPage = TE.TaskEither<RenderPageError, HtmlPage>;

export const listsPage = (dependencies: Dependencies): ListsPage => pipe(
  constructViewModel(dependencies),
  renderAsHtml,
  TE.right,
);
