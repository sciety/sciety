import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { Maybe } from 'true-myth';
import { getActor } from './get-actor';
import { getDescription } from './get-description';
import createGetMostRecentEvents, { GetAllEvents } from './get-most-recent-events';
import createProjectFollowerIds from './project-follower-ids';
import createRenderDescription from './render-description';
import createRenderFeed, { RenderFeed } from './render-feed';
import createRenderFollowToggle, { Follows } from './render-follow-toggle';
import createRenderFollowers from './render-followers';
import createRenderPage, { RenderPage } from './render-page';
import { renderPageHeader } from './render-page-header';
import createRenderSummaryFeedItem from '../shared-components/render-summary-feed-item';
import createRenderSummaryFeedList from '../shared-components/render-summary-feed-list';
import { EditorialCommunity } from '../types/editorial-community';
import { EditorialCommunityId } from '../types/editorial-community-id';
import { FetchExternalArticle } from '../types/fetch-external-article';
import { toHtmlFragment } from '../types/html-fragment';
import { User } from '../types/user';

type FetchStaticFile = (filename: string) => T.Task<string>;

type FetchEditorialCommunity = (editorialCommunityId: EditorialCommunityId) => T.Task<Maybe<EditorialCommunity>>;

interface Ports {
  fetchArticle: FetchExternalArticle;
  fetchStaticFile: FetchStaticFile;
  getEditorialCommunity: FetchEditorialCommunity;
  getAllEvents: GetAllEvents;
  follows: Follows,
}

const buildRenderFeed = (ports: Ports): RenderFeed => {
  const renderSummaryFeedItem = createRenderSummaryFeedItem(getActor(ports.getEditorialCommunity), ports.fetchArticle);
  return createRenderFeed(
    createGetMostRecentEvents(ports.getAllEvents, 20),
    createRenderSummaryFeedList(renderSummaryFeedItem),
    createRenderFollowToggle(ports.follows),
  );
};

export interface Params {
  id?: string;
  user: O.Option<User>;
}

type EditorialCommunityPage = (params: Params) => ReturnType<RenderPage>;

export default (ports: Ports): EditorialCommunityPage => {
  const renderPage = createRenderPage(
    renderPageHeader,
    createRenderDescription(getDescription(ports.fetchStaticFile)),
    buildRenderFeed(ports),
    createRenderFollowers(createProjectFollowerIds(ports.getAllEvents)),
  );
  return (params) => {
    const editorialCommunityId = new EditorialCommunityId(params.id ?? '');
    const userId = pipe(
      params.user,
      O.map((user) => user.id),
    );

    return pipe(
      editorialCommunityId,
      ports.getEditorialCommunity,
      T.chain((editorialCommunityMaybe) => (
        editorialCommunityMaybe.mapOrElse(() => TE.left({
          type: 'not-found',
          message: toHtmlFragment(`Editorial community id '${editorialCommunityId.value}' not found`),
        }),
        (editorialCommunity) => renderPage(editorialCommunity, userId))
      )),
    );
  };
};
