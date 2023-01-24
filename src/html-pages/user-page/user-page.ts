import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { renderErrorPage, renderAsHtml } from './render-as-html';
import { Page } from '../../types/page';
import { RenderPageError } from '../../types/render-page-error';
import { constructViewModel, Params, Ports } from './construct-view-model';

type UserPage = (tab: string) => (params: Params) => TE.TaskEither<RenderPageError, Page>;

export const userPage = (ports: Ports): UserPage => (tab) => (params) => pipe(
  params,
  constructViewModel(tab, ports),
  TE.bimap(renderErrorPage, renderAsHtml),
);
