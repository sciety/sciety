import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructFeedItem, GetArticle } from './construct-feed-item';
import { getDescription } from './get-description';
import { GetAllEvents, getMostRecentEvents } from './get-most-recent-events';
import { projectFollowerIds } from './project-follower-ids';
import { renderDescription } from './render-description';
import { renderFeed, RenderFeed } from './render-feed';
import { Follows, renderFollowToggle } from './render-follow-toggle';
import { renderFollowers } from './render-followers';
import { renderPage, RenderPage } from './render-page';
import { renderPageHeader } from './render-page-header';
import { renderSummaryFeedList } from '../shared-components';
import { EditorialCommunity } from '../types/editorial-community';
import { EditorialCommunityId } from '../types/editorial-community-id';
import { toHtmlFragment } from '../types/html-fragment';
import { User } from '../types/user';

type FetchStaticFile = (filename: string) => TE.TaskEither<'not-found' | 'unavailable', string>;

type FetchEditorialCommunity = (editorialCommunityId: EditorialCommunityId) => T.Task<O.Option<EditorialCommunity>>;

type Ports = {
  fetchArticle: GetArticle,
  fetchStaticFile: FetchStaticFile,
  getEditorialCommunity: FetchEditorialCommunity,
  getAllEvents: GetAllEvents,
  follows: Follows,
};

const buildRenderFeed = (ports: Ports): RenderFeed => renderFeed(
  getMostRecentEvents(ports.getAllEvents, 20),
  constructFeedItem(ports.fetchArticle),
  renderSummaryFeedList,
  renderFollowToggle(ports.follows),
);

export type Params = {
  id?: string,
  user: O.Option<User>,
};

type EditorialCommunityPage = (params: Params) => ReturnType<RenderPage>;

export const editorialCommunityPage = (ports: Ports): EditorialCommunityPage => (params) => {
  const editorialCommunityId = new EditorialCommunityId(params.id ?? '');
  const userId = pipe(
    params.user,
    O.map((user) => user.id),
  );
  return pipe(
    editorialCommunityId,
    ports.getEditorialCommunity,
    T.chain(O.fold(
      () => TE.left({
        type: 'not-found',
        message: toHtmlFragment(`Editorial community id '${editorialCommunityId.value}' not found`),
      } as const),
      (editorialCommunity) => renderPage(
        renderPageHeader,
        renderDescription(getDescription(ports.fetchStaticFile)),
        buildRenderFeed(ports),
        renderFollowers(projectFollowerIds(ports.getAllEvents)),
      )(editorialCommunity, userId),
    )),
  );
};
