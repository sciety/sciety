import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Ports as FollowListPorts } from './follow-list/follow-list';
import { renderErrorPage } from './render-error-page';
import { GetUserViaHandle, SelectAllListsOwnedBy } from '../../shared-ports';
import { Page } from '../../types/page';
import { RenderPageError } from '../../types/render-page-error';
import { renderAsHtml } from './render-as-html';
import { constructViewModel } from './construct-view-model';

// ts-unused-exports:disable-next-line
export type Ports = FollowListPorts & {
  getUserViaHandle: GetUserViaHandle,
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
};

type Params = {
  handle: string,
};

type UserPage = (tab: string) => (params: Params) => TE.TaskEither<RenderPageError, Page>;

export const userPage = (ports: Ports): UserPage => (tab) => (params) => pipe(
  params,
  constructViewModel(tab, ports),
  TE.bimap(renderErrorPage, renderAsHtml),
);
