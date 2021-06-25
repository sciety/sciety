import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { savedArticles, Ports as SavedArticlesPorts } from './saved-articles';
import { tabs } from '../../shared-components/tabs';
import * as DE from '../../types/data-error';
import { Page } from '../../types/page';
import { RenderPageError } from '../../types/render-page-error';
import { UserId } from '../../types/user-id';
import { tabList } from '../tab-list';
import { UserDetails } from '../user-details';
import { userPage } from '../user-page';

type GetUserDetails = (userId: UserId) => TE.TaskEither<DE.DataError, UserDetails>;

type Ports = SavedArticlesPorts & {
  getUserDetails: GetUserDetails,
};

type Params = {
  id: UserId,
};

type SavedArticlesPage = (params: Params) => TE.TaskEither<RenderPageError, Page>;

export const savedArticlesPage = (
  ports: Ports,
): SavedArticlesPage => (params) => pipe(
  savedArticles(ports)(params.id),
  TE.map(({ content }) => tabs({ tabList: tabList(params.id), activeTabIndex: 0 })(content)),
  userPage(ports.getUserDetails(params.id)),
);
