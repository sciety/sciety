import { NotFound } from 'http-errors';
import { Result } from 'true-myth';
import createGetMostRecentEvents, { FilterEvents } from './get-most-recent-events';
import createRenderDescription, { GetEditorialCommunityDescription, RenderDescription } from './render-description';
import createRenderEndorsedArticles, { GetNumberOfEndorsedArticles, RenderEndorsedArticles } from './render-endorsed-articles';
import createRenderFeed, { RenderFeed } from './render-feed';
import createRenderFeedItem, { GetActor, GetArticle } from './render-feed-item';
import createRenderFollowToggle from './render-follow-toggle';
import createRenderPage from './render-page';
import createRenderPageHeader, { GetEditorialCommunity, RenderPageHeader } from './render-page-header';
import createRenderReviews, { GetNumberOfReviews, RenderReviews } from './render-reviews';
import Doi from '../types/doi';
import EditorialCommunityId from '../types/editorial-community-id';
import EditorialCommunityRepository from '../types/editorial-community-repository';
import EndorsementsRepository from '../types/endorsements-repository';
import { FetchExternalArticle } from '../types/fetch-external-article';
import FollowList from '../types/follow-list';
import { ReviewId } from '../types/review-id';

type FindReviewsForEditorialCommunityId = (editorialCommunityId: EditorialCommunityId) => Promise<Array<{
  articleVersionDoi: Doi;
  reviewId: ReviewId;
  added: Date;
}>>;

interface Ports {
  fetchArticle: FetchExternalArticle;
  editorialCommunities: EditorialCommunityRepository;
  endorsements: EndorsementsRepository,
  filterEvents: FilterEvents;
  findReviewsForEditorialCommunityId: FindReviewsForEditorialCommunityId,
}

const buildRenderPageHeader = (editorialCommunities: EditorialCommunityRepository): RenderPageHeader => {
  const getEditorialCommunity: GetEditorialCommunity = async (editorialCommunityId) => {
    const editorialCommunity = (await editorialCommunities.lookup(editorialCommunityId))
      .unwrapOrElse(() => {
        throw new NotFound(`${editorialCommunityId.value} not found`);
      });
    return editorialCommunity;
  };
  return createRenderPageHeader(getEditorialCommunity);
};

const buildRenderDescription = (editorialCommunities: EditorialCommunityRepository): RenderDescription => {
  const getEditorialCommunityDescription: GetEditorialCommunityDescription = async (editorialCommunityId) => {
    const editorialCommunity = (await editorialCommunities.lookup(editorialCommunityId))
      .unwrapOrElse(() => {
        throw new NotFound(`${editorialCommunityId.value} not found`);
      });
    return editorialCommunity.description;
  };
  return createRenderDescription(getEditorialCommunityDescription);
};

const buildRenderEndorsedArticles = (
  endorsements: EndorsementsRepository,
): RenderEndorsedArticles => {
  const getNumberOfEndorsedArticles: GetNumberOfEndorsedArticles = async (editorialCommunityId) => (
    (await endorsements.endorsedBy(editorialCommunityId)).length
  );
  return createRenderEndorsedArticles(getNumberOfEndorsedArticles);
};

const buildRenderReviews = (
  ports: Ports,
): RenderReviews => {
  const getNumberOfReviews: GetNumberOfReviews = async (editorialCommunityId) => (
    (await ports.findReviewsForEditorialCommunityId(editorialCommunityId)).length
  );
  return createRenderReviews(getNumberOfReviews);
};

const buildRenderFeed = (ports: Ports): RenderFeed => {
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
  const getEventsAdapter = createGetMostRecentEvents(ports.filterEvents, 20);
  const renderFeedItem = createRenderFeedItem(getActorAdapter, getArticleAdapter);
  const renderFollowToggle = createRenderFollowToggle();
  return createRenderFeed(getEventsAdapter, renderFeedItem, renderFollowToggle);
};

interface Params {
  id?: string;
  followList: FollowList;
}

type RenderPageError = {
  type: 'not-found',
  content: string,
};

type RenderPage = (params: Params) => Promise<Result<string, RenderPageError>>;

export default (ports: Ports): RenderPage => {
  const renderPageHeader = buildRenderPageHeader(ports.editorialCommunities);
  const renderDescription = buildRenderDescription(ports.editorialCommunities);
  const renderEndorsedArticles = buildRenderEndorsedArticles(ports.endorsements);
  const renderReviews = buildRenderReviews(ports);
  const renderFeed = buildRenderFeed(ports);

  const renderPage = createRenderPage(
    renderPageHeader,
    renderDescription,
    renderEndorsedArticles,
    renderReviews,
    renderFeed,
  );
  return async (params) => {
    const editorialCommunityId = new EditorialCommunityId(params.id ?? '');
    try {
      return Result.ok(await renderPage(editorialCommunityId, params.followList));
    } catch (error) {
      return Result.err({
        type: 'not-found',
        content: `Editorial community id '${editorialCommunityId.value}' not found`,
      });
    }
  };
};
