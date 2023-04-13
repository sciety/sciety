import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructViewModel, Ports } from './construct-view-model/construct-view-model';
import { Page } from '../../types/page';
import { RenderPageError } from '../../types/render-page-error';
import { renderAsHtml } from './render-as-html/render-as-html';

type ListOfUserListsPage = TE.TaskEither<RenderPageError, Page>;

export const listOfUserListsPage = (ports: Ports): ListOfUserListsPage => pipe(
  constructViewModel(ports),
  renderAsHtml,
  TE.right,
);
