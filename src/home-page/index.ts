import createGetMostRecentEvents, { GetFollowList } from './get-most-recent-events';
import createRenderPage, {
  GetActor, GetAllEditorialCommunities, GetArticle, RenderPage,
} from './render-page';
import events from '../data/bootstrap-events';
import EditorialCommunityId from '../types/editorial-community-id';
import EditorialCommunityRepository from '../types/editorial-community-repository';
import { FetchExternalArticle } from '../types/fetch-external-article';
import ReviewReferenceRepository from '../types/review-reference-repository';

interface Ports {
  fetchArticle: FetchExternalArticle;
  editorialCommunities: EditorialCommunityRepository;
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
  const getFollowListAdapter: GetFollowList = async () => [
    new EditorialCommunityId('316db7d9-88cc-4c26-b386-f067e0f56334'), // Review Commons
    new EditorialCommunityId('10360d97-bf52-4aef-b2fa-2f60d319edd8'), // A PREreview Journal Club
    new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'), // eLife
    new EditorialCommunityId('10360d97-bf52-4aef-b2fa-2f60d319edd7'), // PREReview
    new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'), // PeerJ
    new EditorialCommunityId('74fd66e9-3b90-4b5a-a4ab-5be83db4c5de'), // PCI Zoology
  ];
  const getEventsAdapter = createGetMostRecentEvents(getFollowListAdapter, events, 20);

  return createRenderPage(
    editorialCommunitiesAdapter,
    getActorAdapter,
    getArticleAdapter,
    getEventsAdapter,
  );
};
