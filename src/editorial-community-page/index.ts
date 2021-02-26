import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { option } from 'io-ts-types/option';
import { constructFeedItem, GetArticle } from './construct-feed-item';
import { getDescription } from './get-description';
import { GetAllEvents, getMostRecentEvents } from './get-most-recent-events';
import { projectFollowerIds } from './project-follower-ids';
import { renderDescription } from './render-description';
import { renderFeed } from './render-feed';
import { Follows, renderFollowToggle } from './render-follow-toggle';
import { renderFollowers } from './render-followers';
import { renderErrorPage, renderPage, RenderPage } from './render-page';
import { renderPageHeader } from './render-page-header';
import { renderSummaryFeedList } from '../shared-components';
import { EditorialCommunityIdFromString } from '../types/codecs/EditorialCommunityIdFromString';
import { UserIdFromString } from '../types/codecs/UserIdFromString';
import { EditorialCommunity } from '../types/editorial-community';
import { EditorialCommunityId } from '../types/editorial-community-id';
import { toHtmlFragment } from '../types/html-fragment';

type FetchStaticFile = (filename: string) => TE.TaskEither<'not-found' | 'unavailable', string>;

type FetchEditorialCommunity = (editorialCommunityId: EditorialCommunityId) => T.Task<O.Option<EditorialCommunity>>;

type Ports = {
  fetchArticle: GetArticle,
  fetchStaticFile: FetchStaticFile,
  getEditorialCommunity: FetchEditorialCommunity,
  getAllEvents: GetAllEvents,
  follows: Follows,
};

const buildRenderFeed = (ports: Ports) => renderFeed(
  getMostRecentEvents(ports.getAllEvents, 20),
  constructFeedItem(ports.fetchArticle),
  renderSummaryFeedList,
  renderFollowToggle(ports.follows),
);

const inputParams = t.type({
  id: EditorialCommunityIdFromString,
  user: option(t.type({
    id: UserIdFromString,
  })),
});

type EditorialCommunityPage = (params: unknown) => ReturnType<RenderPage>;

export const editorialCommunityPage = (ports: Ports): EditorialCommunityPage => (params) => pipe(
  inputParams.decode(params),
  E.mapLeft(renderErrorPage),
  TE.fromEither,
  TE.chain(({ id, user }) => pipe(
    ports.getEditorialCommunity(id),
    T.chain(O.fold(
      () => TE.left({
        type: 'not-found',
        message: toHtmlFragment(`Editorial community id '${id.value}' not found`),
      } as const),
      (editorialCommunity) => renderPage(
        renderPageHeader,
        renderDescription(getDescription(ports.fetchStaticFile)),
        buildRenderFeed(ports),
        renderFollowers(projectFollowerIds(ports.getAllEvents)),
      )(editorialCommunity, pipe(user, O.map((u) => u.id))),
    )),
  )),
);
