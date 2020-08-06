import createGetMostRecentEvents, { GetFollowList } from './get-most-recent-events';
import createRenderPage, {
  GetActor, GetAllEditorialCommunities, GetArticle, IsFollowed, RenderPage,
} from './render-page';
import events from '../data/bootstrap-events';
import EditorialCommunityRepository from '../types/editorial-community-repository';
import { FetchExternalArticle } from '../types/fetch-external-article';
import ReviewReferenceRepository from '../types/review-reference-repository';

interface Ports {
  fetchArticle: FetchExternalArticle;
  editorialCommunities: EditorialCommunityRepository;
  getFollowList: GetFollowList;
  reviewReferenceRepository: ReviewReferenceRepository;
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

  const getEventsAdapter = createGetMostRecentEvents(ports.getFollowList, events, 20);

  return createRenderPage(
    editorialCommunitiesAdapter,
    getActorAdapter,
    getArticleAdapter,
    getEventsAdapter,
    isFollowedAdapter,
  );
};
