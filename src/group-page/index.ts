import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { option } from 'io-ts-types/option';
import { constructFeedItem, GetArticle } from './construct-feed-item';
import { GetAllEvents, getMostRecentEvents } from './get-most-recent-events';
import { projectFollowerIds } from './project-follower-ids';
import { FetchStaticFile, renderDescription } from './render-description';
import { renderFeed } from './render-feed';
import { Follows, renderFollowToggle } from './render-follow-toggle';
import { renderFollowers } from './render-followers';
import { renderErrorPage, renderPage } from './render-page';
import { renderPageHeader } from './render-page-header';
import { renderSummaryFeedList } from '../shared-components';
import { GroupIdFromString } from '../types/codecs/GroupIdFromString';
import { UserIdFromString } from '../types/codecs/UserIdFromString';
import { Group } from '../types/group';
import { GroupId } from '../types/group-id';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

type FetchEditorialCommunity = (groupId: GroupId) => T.Task<O.Option<Group>>;

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
);

const notFoundResponse = () => ({
  type: 'not-found',
  message: toHtmlFragment('No such group. Please check and try again.'),
} as const);

const inputParams = t.type({
  id: GroupIdFromString,
  user: option(t.type({
    id: UserIdFromString,
  })),
});

type GroupPage = (params: unknown) => TE.TaskEither<RenderPageError, Page>;

export const groupPage = (ports: Ports): GroupPage => (params) => pipe(
  inputParams.decode(params),
  E.mapLeft(renderErrorPage),
  TE.fromEither,
  TE.chain(({ id, user }) => pipe(
    ports.getEditorialCommunity(id),
    T.map(E.fromOption(notFoundResponse)),
    TE.chain((group) => pipe(
      {
        header: TE.right(renderPageHeader(group)),
        description: renderDescription(ports.fetchStaticFile)(group),
        followers: renderFollowers(projectFollowerIds(ports.getAllEvents))(group.id),
        followButton: pipe(
          renderFollowToggle(ports.follows)(pipe(user, O.map((u) => u.id)), group.id),
          T.map(toHtmlFragment),
          TE.rightTask,
        ),
        feed: buildRenderFeed(ports)(group, pipe(user, O.map((u) => u.id))),
      },
      sequenceS(TE.taskEither),
      TE.bimap(renderErrorPage, renderPage(group)),
    )),
  )),
);
