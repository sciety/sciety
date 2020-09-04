import { NotFound } from 'http-errors';
import showdown from 'showdown';
import { Maybe, Result } from 'true-myth';
import createGetMostRecentEvents, { GetAllEvents } from './get-most-recent-events';
import createRenderDescription, { GetEditorialCommunityDescription, RenderDescription } from './render-description';
import createRenderEndorsedArticles, { GetNumberOfEndorsedArticles, RenderEndorsedArticles } from './render-endorsed-articles';
import createRenderFeed, { RenderFeed } from './render-feed';
import createRenderFeedItem, { GetActor, GetArticle } from './render-feed-item';
import createRenderFollowToggle, { Follows } from './render-follow-toggle';
import createRenderFollowers, { GetFollowers } from './render-followers';
import createRenderPage from './render-page';
import createRenderPageHeader, { GetEditorialCommunity, RenderPageHeader } from './render-page-header';
import createRenderReviews, { GetNumberOfReviews, RenderReviews } from './render-reviews';
import Doi from '../types/doi';
import EditorialCommunityId from '../types/editorial-community-id';
import EndorsementsRepository from '../types/endorsements-repository';
import { FetchExternalArticle } from '../types/fetch-external-article';
import { ReviewId } from '../types/review-id';
import { User } from '../types/user';
import toUserId from '../types/user-id';

type FindReviewsForEditorialCommunityId = (editorialCommunityId: EditorialCommunityId) => Promise<Array<{
  articleVersionDoi: Doi;
  reviewId: ReviewId;
  added: Date;
}>>;

type FetchStaticFile = (filename: string) => Promise<string>;

type FetchEditorialCommunity = (editorialCommunityId: EditorialCommunityId) => Promise<Maybe<{
  name: string;
  avatarUrl: string;
  descriptionPath: string;
}>>;

interface Ports {
  fetchArticle: FetchExternalArticle;
  fetchStaticFile: FetchStaticFile;
  getEditorialCommunity: FetchEditorialCommunity;
  endorsements: EndorsementsRepository,
  getAllEvents: GetAllEvents;
  findReviewsForEditorialCommunityId: FindReviewsForEditorialCommunityId,
  follows: Follows,
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
      imageUrl: editorialCommunity.avatarUrl,
      url: `/editorial-communities/${id.value}`,
    };
  };
  const getArticleAdapter: GetArticle = async (id) => (
    (await ports.fetchArticle(id)).unsafelyUnwrap()
  );
  const getEventsAdapter = createGetMostRecentEvents(ports.getAllEvents, 20);
  const renderFeedItem = createRenderFeedItem(getActorAdapter, getArticleAdapter);
  const renderFollowToggle = createRenderFollowToggle(ports.follows);
  return createRenderFeed(getEventsAdapter, renderFeedItem, renderFollowToggle);
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

  const getFollowers: GetFollowers = async (editorialCommunityId) => {
    if (editorialCommunityId.value === 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0') {
      return [{
        avatarUrl: ' https://pbs.twimg.com/profile_images/622704117635543040/DQRaHUah_normal.jpg',
        handle: 'giorgiosironi',
        displayName: 'Giorgio Sironi 🇮🇹🇬🇧🇪🇺',
        userId: toUserId('47998559'),
      }];
    }
    return [];
  };
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
    } catch (error) {
      return Result.err({
        type: 'not-found',
        content: `Editorial community id '${editorialCommunityId.value}' not found`,
      });
    }
  };
};
