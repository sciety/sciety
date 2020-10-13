import { URL } from 'url';
import { Maybe } from 'true-myth';
import createGetMostRecentEvents, { GetAllEvents } from './get-most-recent-events';
import createProjectIsFollowingSomething from './project-is-following-something';
import createRenderEditorialCommunities, { GetAllEditorialCommunities } from './render-editorial-communities';
import createRenderFeed, { IsFollowingSomething } from './render-feed';
import createRenderFeedItem, { GetActor } from './render-feed-item';
import createRenderFindArticle from './render-find-article';
import createRenderFollowToggle from './render-follow-toggle';
import createRenderPage from './render-page';
import createRenderPageHeader from './render-page-header';
import EditorialCommunityId from '../types/editorial-community-id';
import EditorialCommunityRepository from '../types/editorial-community-repository';
import { FetchExternalArticle } from '../types/fetch-external-article';
import { User } from '../types/user';
import { UserId } from '../types/user-id';

type GetEditorialCommunity = (editorialCommunityId: EditorialCommunityId) => Promise<Maybe<{
  name: string;
  avatar: URL;
}>>;

interface Ports {
  fetchArticle: FetchExternalArticle;
  editorialCommunities: EditorialCommunityRepository;
  getEditorialCommunity: GetEditorialCommunity,
  getAllEvents: GetAllEvents,
  follows: (userId: UserId, editorialCommunityId: EditorialCommunityId) => Promise<boolean>,
}

interface Params {
  user: Maybe<User>,
}

type RenderPage = (params: Params) => Promise<string>;

export default (ports: Ports): RenderPage => {
  const editorialCommunitiesAdapter: GetAllEditorialCommunities = async () => ports.editorialCommunities.all();
  const getActorAdapter: GetActor = async (id) => {
    const editorialCommunity = (await ports.getEditorialCommunity(id)).unsafelyUnwrap();
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

  const renderPageHeader = createRenderPageHeader();
  const renderFollowToggle = createRenderFollowToggle(ports.follows);
  const renderEditorialCommunities = createRenderEditorialCommunities(editorialCommunitiesAdapter, renderFollowToggle);
  const renderFindArticle = createRenderFindArticle();
  const renderFeedItem = createRenderFeedItem(getActorAdapter, ports.fetchArticle);
  const renderFeed = createRenderFeed(
    isFollowingSomethingAdapter,
    getEventsAdapter,
    renderFeedItem,
  );
  const renderPage = createRenderPage(
    renderPageHeader,
    renderEditorialCommunities,
    renderFindArticle,
    renderFeed,
  );

  return async (params) => {
    const userId = params.user.map((value) => value.id);

    return renderPage(userId);
  };
};
