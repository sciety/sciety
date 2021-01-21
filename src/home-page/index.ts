import { URL } from 'url';
import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';
import { Maybe } from 'true-myth';
import { getActor } from './get-actor';
import { GetAllEvents, getMostRecentEvents } from './get-most-recent-events';
import { projectIsFollowingSomething } from './project-is-following-something';
import { createRenderEditorialCommunities, GetAllEditorialCommunities } from './render-editorial-communities';
import createRenderEditorialCommunity from './render-editorial-community';
import { createRenderFeed } from './render-feed';
import createRenderFollowToggle from './render-follow-toggle';
import renderPage, { RenderPage } from './render-page';
import renderPageHeader from './render-page-header';
import renderSearchForm from './render-search-form';
import { renderSummaryFeedList } from '../shared-components/render-summary-feed-list';
import { EditorialCommunityId } from '../types/editorial-community-id';
import { FetchExternalArticle } from '../types/fetch-external-article';
import { User } from '../types/user';
import { UserId } from '../types/user-id';

type GetEditorialCommunity = (editorialCommunityId: EditorialCommunityId) => T.Task<Maybe<{
  name: string;
  avatar: URL;
}>>;

interface Ports {
  fetchArticle: FetchExternalArticle;
  getAllEditorialCommunities: GetAllEditorialCommunities;
  getEditorialCommunity: GetEditorialCommunity,
  getAllEvents: GetAllEvents,
  follows: (userId: UserId, editorialCommunityId: EditorialCommunityId) => T.Task<boolean>,
}

interface Params {
  user: O.Option<User>,
}

type HomePage = (params: Params) => ReturnType<RenderPage>;

export default (ports: Ports): HomePage => {
  const renderFollowToggle = createRenderFollowToggle(ports.follows);
  const renderEditorialCommunities = createRenderEditorialCommunities(
    ports.getAllEditorialCommunities,
    createRenderEditorialCommunity(renderFollowToggle),
  );
  const renderFeed = createRenderFeed(
    projectIsFollowingSomething(ports.getAllEvents),
    getMostRecentEvents(ports.getAllEvents, ports.follows, 20),
    renderSummaryFeedList(getActor(ports.getEditorialCommunity), ports.fetchArticle),
  );

  return (params) => pipe(
    params.user,
    O.map((user) => user.id),
    renderPage(renderPageHeader, renderEditorialCommunities, renderSearchForm, renderFeed),
  );
};
