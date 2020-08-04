import createRenderPage, {
  GetActor, GetAllEditorialCommunities, GetArticle, GetEvents, RenderPage,
} from './render-page';
import events from '../data/bootstrap-events';
import EditorialCommunityRepository from '../types/editorial-community-repository';
import { Event } from '../types/events';
import { FetchExternalArticle } from '../types/fetch-external-article';
import { NonEmptyArray } from '../types/non-empty-array';
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
  const getEventsAdapter: GetEvents = async () => {
    events.sort((a, b) => b.date.getTime() - a.date.getTime());
    return events.slice(0, 20) as unknown as NonEmptyArray<Event>;
  };

  return createRenderPage(
    editorialCommunitiesAdapter,
    getActorAdapter,
    getArticleAdapter,
    getEventsAdapter,
  );
};
