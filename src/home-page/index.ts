import { URL } from 'url';
import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';
import { Maybe, Result } from 'true-myth';
import createGetMostRecentEvents, { GetAllEvents } from './get-most-recent-events';
import createProjectIsFollowingSomething from './project-is-following-something';
import createRenderEditorialCommunities, { GetAllEditorialCommunities } from './render-editorial-communities';
import createRenderEditorialCommunity from './render-editorial-community';
import createRenderFeed, { IsFollowingSomething } from './render-feed';
import createRenderFollowToggle from './render-follow-toggle';
import createRenderPage from './render-page';
import renderPageHeader from './render-page-header';
import renderSearchForm from './render-search-form';
import createRenderSummaryFeedItem, { GetActor } from '../shared-components/render-summary-feed-item';
import createRenderSummaryFeedList from '../shared-components/render-summary-feed-list';
import EditorialCommunityId from '../types/editorial-community-id';
import { FetchExternalArticle } from '../types/fetch-external-article';
import { HtmlFragment } from '../types/html-fragment';
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

type HomePage = (params: Params) => Promise<Result<{
  title: string,
  content: HtmlFragment
}, never>>;

export default (ports: Ports): HomePage => {
  const getActorAdapter: GetActor = (id) => async () => {
    const editorialCommunity = (await ports.getEditorialCommunity(id)()).unsafelyUnwrap();
    return {
      name: editorialCommunity.name,
      imageUrl: editorialCommunity.avatar.toString(),
      url: `/editorial-communities/${id.value}`,
    };
  };
  const isFollowingSomethingAdapter: IsFollowingSomething = createProjectIsFollowingSomething(ports.getAllEvents);
  const getEventsAdapter = createGetMostRecentEvents(
    ports.getAllEvents,
    ports.follows,
    20,
  );

  const renderFollowToggle = createRenderFollowToggle(ports.follows);
  const renderEditorialCommunity = createRenderEditorialCommunity(renderFollowToggle);
  const renderEditorialCommunities = createRenderEditorialCommunities(
    ports.getAllEditorialCommunities,
    renderEditorialCommunity,
  );
  const renderSummaryFeedItem = createRenderSummaryFeedItem(getActorAdapter, ports.fetchArticle);
  const renderSummaryFeedList = createRenderSummaryFeedList(renderSummaryFeedItem);
  const renderFeed = createRenderFeed(
    isFollowingSomethingAdapter,
    getEventsAdapter,
    renderSummaryFeedList,
  );
  const renderPage = createRenderPage(
    renderPageHeader,
    renderEditorialCommunities,
    renderSearchForm,
    renderFeed,
  );

  return async (params) => pipe(
    params.user,
    O.map((user) => user.id),
    renderPage,
  )();
};
