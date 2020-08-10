import createGetMostRecentEvents, { FilterEvents, GetFollowList } from './get-most-recent-events';
import createRenderEditorialCommunities, { GetAllEditorialCommunities } from './render-editorial-communities';
import createRenderFeed from './render-feed';
import createRenderFeedItem, { GetActor, GetArticle } from './render-feed-item';
import createRenderFindArticle from './render-find-article';
import createRenderFollowToggle, { IsFollowed } from './render-follow-toggle';
import createRenderPage, { RenderPage } from './render-page';
import createRenderPageHeader from './render-page-header';
import EditorialCommunityRepository from '../types/editorial-community-repository';
import { FetchExternalArticle } from '../types/fetch-external-article';

interface Ports {
  fetchArticle: FetchExternalArticle;
  editorialCommunities: EditorialCommunityRepository;
  getFollowList: GetFollowList;
  filterEvents: FilterEvents,
}

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
  const isFollowedAdapter: IsFollowed = async (editorialCommunityId) => (
    (await ports.getFollowList()).follows(editorialCommunityId)
  );
  const getEventsAdapter = createGetMostRecentEvents(ports.getFollowList, ports.filterEvents, 20);

  const renderPageHeader = createRenderPageHeader();
  const renderFollowToggle = createRenderFollowToggle(isFollowedAdapter);
  const renderEditorialCommunities = createRenderEditorialCommunities(editorialCommunitiesAdapter, renderFollowToggle);
  const renderFindArticle = createRenderFindArticle();
  const renderFeedItem = createRenderFeedItem(getActorAdapter, getArticleAdapter);
  const renderFeed = createRenderFeed(getEventsAdapter, renderFeedItem);

  return createRenderPage(
    renderPageHeader,
    renderEditorialCommunities,
    renderFindArticle,
    renderFeed,
  );
};
