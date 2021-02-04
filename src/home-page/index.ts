import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { constructFeedItem, GetArticle } from './construct-feed-item';
import { getActor } from './get-actor';
import { GetAllEvents, getMostRecentEvents } from './get-most-recent-events';
import { projectIsFollowingSomething } from './project-is-following-something';
import { createRenderEditorialCommunities, GetAllEditorialCommunities } from './render-editorial-communities';
import { createRenderEditorialCommunity } from './render-editorial-community';
import { createRenderFeed } from './render-feed';
import { createRenderFollowToggle } from './render-follow-toggle';
import { renderPage, RenderPage } from './render-page';
import { renderPageHeader } from './render-page-header';
import { renderSearchForm } from './render-search-form';
import { renderSummaryFeedList } from '../shared-components/render-summary-feed-list';
import { EditorialCommunityId } from '../types/editorial-community-id';
import { User } from '../types/user';
import { UserId } from '../types/user-id';

type GetEditorialCommunity = (editorialCommunityId: EditorialCommunityId) => T.Task<O.Option<{
  name: string,
  avatarPath: string,
}>>;

type Ports = {
  fetchArticle: GetArticle,
  getAllEditorialCommunities: GetAllEditorialCommunities,
  getEditorialCommunity: GetEditorialCommunity,
  getAllEvents: GetAllEvents,
  follows: (userId: UserId, editorialCommunityId: EditorialCommunityId) => T.Task<boolean>,
};

type Params = {
  user: O.Option<User>,
};

type HomePage = (params: Params) => ReturnType<RenderPage>;

export const homePage = (ports: Ports): HomePage => {
  const renderFollowToggle = createRenderFollowToggle(ports.follows);
  const renderEditorialCommunities = createRenderEditorialCommunities(
    ports.getAllEditorialCommunities,
    createRenderEditorialCommunity(renderFollowToggle),
  );
  const renderFeed = createRenderFeed(
    projectIsFollowingSomething(ports.getAllEvents),
    getMostRecentEvents(ports.getAllEvents, ports.follows, 20),
    flow(
      T.traverseArray(constructFeedItem(getActor(ports.getEditorialCommunity), ports.fetchArticle)),
      T.map(renderSummaryFeedList),
    ),
  );

  return (params) => pipe(
    params.user,
    O.map((user) => user.id),
    renderPage(renderPageHeader, renderEditorialCommunities, renderSearchForm, renderFeed),
  );
};
