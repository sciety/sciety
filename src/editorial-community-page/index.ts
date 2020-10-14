import { URL } from 'url';
import { NotFound } from 'http-errors';
import showdown from 'showdown';
import { Maybe, Result } from 'true-myth';
import createGetFollowersFromIds, { GetUserDetails } from './get-followers-from-ids';
import createGetMostRecentEvents, { GetAllEvents } from './get-most-recent-events';
import createProjectFollowerIds from './project-follower-ids';
import createRenderDescription, { GetEditorialCommunityDescription, RenderDescription } from './render-description';
import createRenderEndorsedArticles, { GetNumberOfEndorsedArticles, RenderEndorsedArticles } from './render-endorsed-articles';
import createRenderFeed, { RenderFeed } from './render-feed';
import createRenderFollowToggle, { Follows } from './render-follow-toggle';
import createRenderFollowers from './render-followers';
import createRenderPage from './render-page';
import createRenderPageHeader, { GetEditorialCommunity, RenderPageHeader } from './render-page-header';
import createRenderReviews, { GetNumberOfReviews, RenderReviews } from './render-reviews';
import createRenderFeedList from '../templates/render-feed-list';
import createRenderSummaryFeedItem, { GetActor } from '../templates/render-summary-feed-item';
import Doi from '../types/doi';
import EditorialCommunityId from '../types/editorial-community-id';
import EndorsementsRepository from '../types/endorsements-repository';
import { FetchExternalArticle } from '../types/fetch-external-article';
import { ReviewId } from '../types/review-id';
import { User } from '../types/user';
import { UserId } from '../types/user-id';

type FindReviewsForEditorialCommunityId = (editorialCommunityId: EditorialCommunityId) => Promise<Array<{
  articleDoi: Doi;
  reviewId: ReviewId;
  added: Date;
}>>;

type FetchStaticFile = (filename: string) => Promise<string>;

type FetchEditorialCommunity = (editorialCommunityId: EditorialCommunityId) => Promise<Maybe<{
  name: string;
  avatar: URL;
  descriptionPath: string;
}>>;

type GetUserDetailsResult = (userId: UserId) => Promise<Result<{
  handle: string,
  displayName: string,
  avatarUrl: string,
}, unknown>>;

interface Ports {
  fetchArticle: FetchExternalArticle;
  fetchStaticFile: FetchStaticFile;
  getEditorialCommunity: FetchEditorialCommunity;
  endorsements: EndorsementsRepository,
  getAllEvents: GetAllEvents;
  findReviewsForEditorialCommunityId: FindReviewsForEditorialCommunityId,
  follows: Follows,
  getUserDetails: GetUserDetailsResult,
}

const buildRenderPageHeader = (ports: Ports): RenderPageHeader => {
  const getEditorialCommunity: GetEditorialCommunity = async (editorialCommunityId) => {
    const editorialCommunity = (await ports.getEditorialCommunity(editorialCommunityId))
      .unwrapOrElse(() => {
        throw new NotFound(`${editorialCommunityId.value} not found`);
      });
    return editorialCommunity;
  };
  return createRenderPageHeader(getEditorialCommunity);
};

const buildRenderDescription = (ports: Ports): RenderDescription => {
  const converter = new showdown.Converter({ noHeaderId: true });
  const getEditorialCommunityDescription: GetEditorialCommunityDescription = async (editorialCommunityId) => {
    const editorialCommunity = (await ports.getEditorialCommunity(editorialCommunityId))
      .unwrapOrElse(() => {
        throw new NotFound(`${editorialCommunityId.value} not found`);
      });
    const markdown = await ports.fetchStaticFile(`editorial-communities/${editorialCommunity.descriptionPath}`);
    return converter.makeHtml(markdown);
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
    const editorialCommunity = (await ports.getEditorialCommunity(id)).unsafelyUnwrap();
    return {
      name: editorialCommunity.name,
      imageUrl: editorialCommunity.avatar.toString(),
      url: `/editorial-communities/${id.value}`,
    };
  };
  const getEventsAdapter = createGetMostRecentEvents(ports.getAllEvents, 20);
  const renderFeedItem = createRenderSummaryFeedItem(getActorAdapter, ports.fetchArticle);
  const renderFollowToggle = createRenderFollowToggle(ports.follows);
  return createRenderFeed(
    getEventsAdapter,
    createRenderFeedList(renderFeedItem),
    renderFollowToggle,
  );
};

export interface Params {
  id?: string;
  user: Maybe<User>;
}

type RenderPageError = {
  type: 'not-found',
  content: string,
};

type RenderPage = (params: Params) => Promise<Result<string, RenderPageError>>;

export default (ports: Ports): RenderPage => {
  const renderPageHeader = buildRenderPageHeader(ports);
  const renderDescription = buildRenderDescription(ports);
  const renderEndorsedArticles = buildRenderEndorsedArticles(ports.endorsements);
  const renderReviews = buildRenderReviews(ports);
  const renderFeed = buildRenderFeed(ports);

  const getUserDetails: GetUserDetails = async (userId) => {
    const userDetails = await ports.getUserDetails(userId);

    return userDetails.unsafelyUnwrap();
  };
  const getFollowers = createGetFollowersFromIds(createProjectFollowerIds(ports.getAllEvents), getUserDetails);
  const renderFollowers = createRenderFollowers(getFollowers);

  const renderPage = createRenderPage(
    renderPageHeader,
    renderDescription,
    renderEndorsedArticles,
    renderReviews,
    renderFeed,
    renderFollowers,
  );
  return async (params) => {
    const editorialCommunityId = new EditorialCommunityId(params.id ?? '');
    const userId = params.user.map((value) => value.id);

    try {
      return Result.ok(await renderPage(editorialCommunityId, userId));
    } catch (error: unknown) {
      return Result.err({
        type: 'not-found',
        content: `Editorial community id '${editorialCommunityId.value}' not found`,
      });
    }
  };
};
