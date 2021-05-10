import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { flow, pipe } from 'fp-ts/function';
import { countFollowersOf } from './count-followers';
import { constructRecentGroupActivity } from './recent-activity/construct-recent-group-activity';
import { FetchStaticFile, renderDescription } from './render-description';
import { renderFollowers } from './render-followers';
import { renderErrorPage, renderPage } from './render-page';
import { renderPageHeader } from './render-page-header';
import { renderFollowToggle } from '../follow/render-follow-toggle';
import { fetchArticleDetails } from '../shared-components/article-card/fetch-article-details';
import { FindVersionsForArticleDoi, getLatestArticleVersionDate } from '../shared-components/article-card/get-latest-article-version-date';
import { ArticleServer } from '../types/article-server';
import { Doi } from '../types/doi';
import { DomainEvent } from '../types/domain-events';
import { Group } from '../types/group';
import { GroupId } from '../types/group-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';
import { User } from '../types/user';
import { UserId } from '../types/user-id';

type RecentActivityPorts = {
  fetchArticle: GetArticle,
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
  getAllEvents: GetAllEvents,
};

type RecentActivity = (ports: RecentActivityPorts) => (group: Group) => TE.TaskEither<never, string | HtmlFragment>;

const recentActivity: RecentActivity = (ports) => (group) => pipe(
  group.id,
  constructRecentGroupActivity(
    fetchArticleDetails(
      getLatestArticleVersionDate(ports.findVersionsForArticleDoi),
      flow(ports.fetchArticle, T.map(O.fromEither)),
    ),
    ports.getAllEvents,
  ),
  TE.rightTask,
);

type FetchGroup = (groupId: GroupId) => TO.TaskOption<Group>;

type Article = {
  title: SanitisedHtmlFragment,
  server: ArticleServer,
  authors: ReadonlyArray<string>,
};
type GetArticle = (id: Doi) => TE.TaskEither<unknown, Article>;
type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

type Ports = RecentActivityPorts & {
  fetchStaticFile: FetchStaticFile,
  getGroup: FetchGroup,
  getAllEvents: GetAllEvents,
  follows: (userId: UserId, groupId: GroupId) => T.Task<boolean>,
};

type Params = {
  id: GroupId,
  user: O.Option<User>,
};

const notFoundResponse = () => ({
  type: 'not-found',
  message: toHtmlFragment('No such group. Please check and try again.'),
} as const);

type GroupPage = (params: Params) => TE.TaskEither<RenderPageError, Page>;

export const groupPage = (ports: Ports): GroupPage => ({ id, user }) => pipe(
  ports.getGroup(id),
  T.map(E.fromOption(notFoundResponse)),
  TE.chain((group) => pipe(
    {
      header: pipe(
        group,
        renderPageHeader,
        TE.right,
      ),
      description: pipe(
        `groups/${group.descriptionPath}`,
        ports.fetchStaticFile,
        TE.map(renderDescription),
      ),
      followers: pipe(
        ports.getAllEvents,
        T.map(flow(
          countFollowersOf(group.id),
          renderFollowers,
          E.right,
        )),
      ),
      followButton: pipe(
        user,
        O.fold(
          () => T.of(false),
          (u) => ports.follows(u.id, group.id),
        ),
        T.map(renderFollowToggle(group.id, group.name)),
        TE.rightTask,
      ),
      feed: recentActivity(ports)(group),
    },
    sequenceS(TE.ApplyPar),
    TE.bimap(renderErrorPage, renderPage(group)),
  )),
);
