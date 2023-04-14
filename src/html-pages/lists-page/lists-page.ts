import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructViewModel, Ports } from './construct-view-model/construct-view-model';
import { Page } from '../../types/page';
import { RenderPageError } from '../../types/render-page-error';
import { renderAsHtml } from './render-as-html/render-as-html';

type ListsPage = TE.TaskEither<RenderPageError, Page>;

export const listsPage = (ports: Ports): ListsPage => pipe(
  constructViewModel(ports),
  renderAsHtml,
  TE.right,
);
