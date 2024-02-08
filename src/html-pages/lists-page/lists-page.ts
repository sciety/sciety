import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructViewModel, Dependencies } from './construct-view-model/construct-view-model';
import { HtmlPage } from '../html-page';
import { ErrorPageBodyViewModel } from '../../types/error-page-body-view-model';
import { renderAsHtml } from './render-as-html/render-as-html';

type ListsPage = TE.TaskEither<ErrorPageBodyViewModel, HtmlPage>;

export const listsPage = (dependencies: Dependencies): ListsPage => pipe(
  constructViewModel(dependencies),
  renderAsHtml,
  TE.right,
);
