import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { renderErrorPage, renderAsHtml } from './render-as-html';
import { Page } from '../../../types/page';
import { RenderPageError } from '../../../types/render-page-error';
import { constructViewModel, Params, Ports } from './construct-view-model';
import { TabSelector } from './view-model';

type UserPage = (tabSelector: TabSelector) => (params: Params) => TE.TaskEither<RenderPageError, Page>;

// ts-unused-exports:disable-next-line
export const userPage = (ports: Ports): UserPage => (tabSelector) => (params) => pipe(
  params,
  constructViewModel(tabSelector, ports),
  TE.bimap(renderErrorPage, renderAsHtml),
);
