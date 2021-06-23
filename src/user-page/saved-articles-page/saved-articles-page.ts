import { sequenceS } from 'fp-ts/Apply';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { savedArticles, Ports as SavedArticlesPorts } from './saved-articles';
import { tabs } from '../../shared-components/tabs';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

import { Page } from '../../types/page';
import { RenderPageError } from '../../types/render-page-error';
import { UserId } from '../../types/user-id';
import { renderErrorPage } from '../render-error-page';
import { renderHeader, UserDetails } from '../render-header';
import { renderPage } from '../render-page';
import { tabList } from '../tab-list';

type GetUserDetails = (userId: UserId) => TE.TaskEither<'not-found' | 'unavailable', UserDetails>;

type Ports = SavedArticlesPorts & {
  getUserDetails: GetUserDetails,
};

type Params = {
  id: UserId,
};

type SavedArticlesPage = (params: Params) => TE.TaskEither<RenderPageError, Page>;

type Tabs = (activeTabPanelContents: HtmlFragment) => HtmlFragment;

type UserPage = (fooParam: {
  userPageTabs: Tabs,
  tabContent: TE.TaskEither<never, HtmlFragment>,
  userDetails: ReturnType<GetUserDetails>,
}) => TE.TaskEither<RenderPageError, Page>;

const userPage: UserPage = flow(
  ({
    userPageTabs,
    userDetails,
    tabContent,
  }) => ({
    header: pipe(
      userDetails,
      TE.map(renderHeader),
    ),
    userDisplayName: pipe(
      userDetails,
      TE.map(flow(
        ({ displayName }) => displayName,
        toHtmlFragment,
      )),
    ),
    tabs: pipe(
      tabContent,
      TE.map(userPageTabs),
    ),
  }),
  sequenceS(TE.ApplyPar),
  TE.bimap(renderErrorPage, renderPage),
);

export const savedArticlesPage = (ports: Ports): SavedArticlesPage => (params) => pipe(
  {
    userPageTabs: tabs({ tabList: tabList(params.id), activeTabIndex: 0 }),
    userDetails: ports.getUserDetails(params.id),
    tabContent: savedArticles(ports)(params.id),
  },
  userPage,
);
