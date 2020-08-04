import createRenderPage, {
  Event, GetActor, GetAllEditorialCommunities, GetArticle, GetEvents, RenderPage,
} from './render-page';
import Doi from '../types/doi';
import EditorialCommunityId from '../types/editorial-community-id';
import EditorialCommunityRepository from '../types/editorial-community-repository';
import { FetchExternalArticle } from '../types/fetch-external-article';
import { NonEmptyArray } from '../types/non-empty-array';
import ReviewReferenceRepository from '../types/review-reference-repository';

interface Ports {
  fetchArticle: FetchExternalArticle;
  editorialCommunities: EditorialCommunityRepository;
  reviewReferenceRepository: ReviewReferenceRepository;
}

const events: NonEmptyArray<Event> = [
  {
    type: 'ArticleReviewed',
    date: new Date('2020-07-09'),
    actorId: new EditorialCommunityId('10360d97-bf52-4aef-b2fa-2f60d319edd8'),
    articleId: new Doi('10.1101/2020.01.22.915660'),
  },
  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-09'),
    actorId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'),
    articleId: new Doi('10.1101/751099'),
  },
  {
    type: 'ArticleReviewed',
    date: new Date('2020-07-09'),
    actorId: new EditorialCommunityId('316db7d9-88cc-4c26-b386-f067e0f56334'),
    articleId: new Doi('10.1101/2019.12.13.875419'),
  },
  {
    type: 'ArticleReviewed',
    date: new Date('2020-07-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.05.14.095547'),
  },
  {
    type: 'ArticleReviewed',
    date: new Date('2020-07-08'),
    actorId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'),
    articleId: new Doi('10.1101/751099'),
  },
  {
    type: 'ArticleReviewed',
    date: new Date('2020-07-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.05.14.095547'),
  },
  {
    type: 'EditorialCommunityJoined',
    date: new Date('2020-06-18'),
    actorId: new EditorialCommunityId('316db7d9-88cc-4c26-b386-f067e0f56334'),
  },
  {
    type: 'EditorialCommunityJoined',
    date: new Date('2020-06-14'),
    actorId: new EditorialCommunityId('10360d97-bf52-4aef-b2fa-2f60d319edd8'),
  },
];

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
  const getEventsAdapter: GetEvents = async () => events;

  return createRenderPage(
    editorialCommunitiesAdapter,
    getActorAdapter,
    getArticleAdapter,
    getEventsAdapter,
  );
};
