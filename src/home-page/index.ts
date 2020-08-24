import createGetMostRecentEvents, { FilterEvents } from './get-most-recent-events';
import createProjectFollowListForUser, { GetAllEvents } from './project-follow-list-for-user';
import createRenderEditorialCommunities, { GetAllEditorialCommunities } from './render-editorial-communities';
import createRenderFeed from './render-feed';
import createRenderFeedItem, { GetActor, GetArticle } from './render-feed-item';
import createRenderFindArticle from './render-find-article';
import createRenderFollowToggle from './render-follow-toggle';
import createRenderPage from './render-page';
import createRenderPageHeader from './render-page-header';
import EditorialCommunityRepository from '../types/editorial-community-repository';
import { FetchExternalArticle } from '../types/fetch-external-article';
import FollowList from '../types/follow-list';
import { User } from '../types/user';

interface Ports {
  fetchArticle: FetchExternalArticle;
  editorialCommunities: EditorialCommunityRepository;
  filterEvents: FilterEvents,
  getAllEvents: GetAllEvents,
}

interface Params {
  followList: FollowList,
  user: User,
}

type RenderPage = (params: Params) => Promise<string>;

export default (ports: Ports): RenderPage => {
  const editorialCommunitiesAdapter: GetAllEditorialCommunities = async () => ports.editorialCommunities.all();
  const getActorAdapter: GetActor = async (id) => {
    const editorialCommunity = (await ports.editorialCommunities.lookup(id)).unsafelyUnwrap();
    return {
      name: editorialCommunity.name,
      imageUrl: editorialCommunity.avatarUrl,
      url: `/editorial-communities/${id.value}`,
    };
  };
  const getArticleAdapter: GetArticle = async (id) => (
    (await ports.fetchArticle(id)).unsafelyUnwrap()
  );
  const getFollowListAdapter = createProjectFollowListForUser(ports.getAllEvents);
  const getEventsAdapter = createGetMostRecentEvents(ports.filterEvents, 20);

  const renderPageHeader = createRenderPageHeader();
  const renderFollowToggle = createRenderFollowToggle();
  const renderEditorialCommunities = createRenderEditorialCommunities(editorialCommunitiesAdapter, renderFollowToggle);
  const renderFindArticle = createRenderFindArticle();
  const renderFeedItem = createRenderFeedItem(getActorAdapter, getArticleAdapter);
  const renderFeed = createRenderFeed(
    getFollowListAdapter,
    getEventsAdapter,
    renderFeedItem,
  );
  const renderPage = createRenderPage(
    renderPageHeader,
    renderEditorialCommunities,
    renderFindArticle,
    renderFeed,
  );

  return async (params) => (
    renderPage(params.user.id, params.followList)
  );
};
