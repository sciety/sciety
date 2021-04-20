import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import {
  constant, flow, pipe, tupled,
} from 'fp-ts/function';
import { countFollowersOf } from './count-followers';
import { fetchArticleDetails, FindVersionsForArticleDoi } from './fetch-article-details';
import { GetAllEvents } from './get-most-recent-events';
import { groupActivities } from './group-activities';
import { FetchStaticFile, renderDescription } from './render-description';
import { renderFollowers } from './render-followers';
import { renderErrorPage, renderPage } from './render-page';
import { renderPageHeader } from './render-page-header';
import { renderRecentGroupActivity } from './render-recent-group-activity';
import { renderFollowToggle } from '../follow/render-follow-toggle';
import { ArticleServer } from '../types/article-server';
import { Doi } from '../types/doi';
import { Group } from '../types/group';
import { GroupId } from '../types/group-id';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';
import { User } from '../types/user';
import { UserId } from '../types/user-id';

type FetchGroup = (groupId: GroupId) => TO.TaskOption<Group>;

type Article = {
  title: SanitisedHtmlFragment,
  server: ArticleServer,
  authors: ReadonlyArray<string>,
};
type GetArticle = (id: Doi) => TE.TaskEither<unknown, Article>;

type Ports = {
  fetchArticle: GetArticle,
  fetchStaticFile: FetchStaticFile,
  getGroup: FetchGroup,
  getAllEvents: GetAllEvents,
  follows: (userId: UserId, groupId: GroupId) => T.Task<boolean>,
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
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

type GetLatestArticleVersionDate = (
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
) => (articleDoi: Doi, server: ArticleServer) => TO.TaskOption<Date>;

const getLatestArticleVersionDate: GetLatestArticleVersionDate = (findVersionsForArticleDoi) => (doi, server) => pipe(
  [doi, server],
  tupled(findVersionsForArticleDoi),
  T.map(O.map(flow(
    RNEA.last,
    (version) => version.occurredAt,
  ))),
);

type GetArticleDetails = (doi: Doi) => T.Task<O.Option<{
  title: SanitisedHtmlFragment,
  authors: ReadonlyArray<string>,
  latestVersionDate: Date,
}>>;

const constructRecentGroupActivity = (
  getArticleDetails: GetArticleDetails,
  getAllEvents: GetAllEvents,
) => (groupId: GroupId) => pipe(
  getAllEvents,
  T.map((events) => groupActivities(events)(groupId)),
  TO.chain(TO.traverseArray((evaluatedArticle) => pipe(
    evaluatedArticle.doi,
    getArticleDetails,
    TO.map((articleDetails) => ({
      ...evaluatedArticle,
      ...articleDetails,
    })),
  ))),
  TO.match(
    constant('<p>We couldn\'t find this information; please try again later.</p>'),
    renderRecentGroupActivity,
  ),
  TE.rightTask,
);

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
      feed: constructRecentGroupActivity(
        fetchArticleDetails(
          getLatestArticleVersionDate(ports.findVersionsForArticleDoi),
          (doi: Doi) => pipe(
            doi,
            ports.fetchArticle,
            T.map(O.fromEither),
          ),
        ),
        ports.getAllEvents,
      )(group.id),
    },
    sequenceS(TE.ApplyPar),
    TE.bimap(renderErrorPage, renderPage(group)),
  )),
);
