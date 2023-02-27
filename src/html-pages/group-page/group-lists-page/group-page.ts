import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Page } from '../../../types/page';
import { RenderPageError } from '../../../types/render-page-error';
import { renderAsHtml } from './render-as-html/render-as-html';
import { renderErrorPage } from './render-as-html/render-error-page';
import { constructViewModel, Ports, Params } from './construct-view-model/construct-view-model';
import { TabIndex } from './content-model';

// ts-unused-exports:disable-next-line
export { paramsCodec } from './construct-view-model/construct-view-model';

// ts-unused-exports:disable-next-line
export const groupPageTabs: Record<string, TabIndex> = {
  lists: 0,
  about: 1,
  followers: 2,
};

type GroupPage = (
  ports: Ports
) => (
  activeTabIndex: TabIndex
) => (
  params: Params
) => TE.TaskEither<RenderPageError, Page>;

export const groupPage: GroupPage = (ports) => (activeTabIndex) => (params) => pipe(
  params,
  constructViewModel(ports, activeTabIndex),
  TE.bimap(renderErrorPage, renderAsHtml),
);
