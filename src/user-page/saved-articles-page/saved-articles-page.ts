import { sequenceS } from 'fp-ts/Apply';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { GetAllEvents, projectSavedArticleDois } from './project-saved-article-dois';
import { savedArticles, Ports as SavedArticlesPorts } from './saved-articles';
import { tabs } from '../../shared-components/tabs';
import * as DE from '../../types/data-error';
import { toHtmlFragment } from '../../types/html-fragment';
import { Page } from '../../types/page';
import { RenderPageError } from '../../types/render-page-error';
import { UserId } from '../../types/user-id';
import { followedGroupIds } from '../followed-groups-page/project-followed-group-ids';
import { renderDescription } from '../render-description';
import { renderErrorPage } from '../render-error-page';
import { renderHeader } from '../render-header';
import { renderPage } from '../render-page';
import { tabList } from '../tab-list';
import { UserDetails } from '../user-details';

type GetUserDetails = (userId: UserId) => TE.TaskEither<DE.DataError, UserDetails>;

type Ports = SavedArticlesPorts & {
  getAllEvents: GetAllEvents,
  getUserDetails: GetUserDetails,
};

type Params = {
  id: UserId,
};

type SavedArticlesPage = (tab: string) => (params: Params) => TE.TaskEither<RenderPageError, Page>;

export const savedArticlesPage = (ports: Ports): SavedArticlesPage => (tab) => ({ id }) => pipe(
  {
    dois: TE.rightTask(projectSavedArticleDois(ports.getAllEvents)(id)),
    groupIds: TE.rightTask(followedGroupIds(ports.getAllEvents)(id)),
    userDetails: ports.getUserDetails(id),
    activeTabIndex: TE.right(tab === 'saved-articles' ? 0 as const : 1 as const),
  },
  sequenceS(TE.ApplyPar),
  TE.chainTaskK((inputs) => pipe(
    (inputs.activeTabIndex === 0) ? savedArticles(ports)(inputs.dois) : savedArticles(ports)(inputs.dois),
    T.map(tabs({
      tabList: tabList(id, inputs.dois.length, inputs.groupIds.length),
      activeTabIndex: inputs.activeTabIndex,
    })),
    T.map((mainContent) => ({
      header: renderHeader(inputs.userDetails),
      userDisplayName: toHtmlFragment(inputs.userDetails.displayName),
      description: renderDescription(inputs.dois.length, inputs.groupIds.length),
      mainContent,
    })),
  )),
  TE.bimap(renderErrorPage, renderPage),
);
