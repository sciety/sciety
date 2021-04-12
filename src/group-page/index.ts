import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { constructFeedItem, GetArticle } from './construct-feed-item';
import { countFollowersOf } from './count-followers';
import { GetAllEvents, getMostRecentEvents } from './get-most-recent-events';
import { FetchStaticFile, renderDescription } from './render-description';
import { renderFeed } from './render-feed';
import { renderFollowers } from './render-followers';
import { renderErrorPage, renderPage } from './render-page';
import { renderPageHeader } from './render-page-header';
import { renderFollowToggle } from '../follow/render-follow-toggle';
import { Doi } from '../types/doi';
import { Group } from '../types/group';
import { GroupId } from '../types/group-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';
import { User } from '../types/user';
import { UserId } from '../types/user-id';

type FetchGroup = (groupId: GroupId) => T.Task<O.Option<Group>>;

type Ports = {
  fetchArticle: GetArticle,
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

const hardcodedArticleList = `<ul class="search-results-list" role="list">
  <li class="search-results-list__item">
    <div class="search-results-list__item_container">
      <a class="search-results-list__item__link" href="/articles/activity/10.1101/2020.09.15.286153">Accuracy of predicting chemical body composition of growing pigs using dual-energy X-ray absorptiometry</a>
      <div class="search-results-list__item__description">
        Kasper C, Schlegel P, Ruiz-Ascacibar I, Stoll P, Bee G.
      </div>
      <span class="search-results-list__item__meta">
        <span>1 evaluation</span><span>Latest version <time datetime="2020-12-14">Dec 14, 2020</time></span><span>Latest activity <time datetime="2020-12-15">Dec 15, 2020</time></span>
      </span>
    </div>
  </li>
  <li class="search-results-list__item">
    <div class="search-results-list__item_container">
      <a class="search-results-list__item__link" href="/articles/activity/10.1101/2019.12.20.884056">Determining insulin sensitivity from glucose tolerance tests in Iberian and Landrace pigs</a>
      <div class="search-results-list__item__description">
        Rodríguez-López J, Lachica M, González-Valero L, Fernández-Fígares I.
      </div>
      <span class="search-results-list__item__meta">
        <span>4 evaluations</span><span>Latest version <time datetime="2020-10-14">Oct 14, 2020</time></span><span>Latest activity <time datetime="2021-03-10">Mar 10, 2021</time></span>
      </span>
    </div>
  </li>
  <li class="search-results-list__item">
    <div class="search-results-list__item_container">
      <a class="search-results-list__item__link" href="/articles/activity/10.1101/760082">Effects of feeding treatment on growth rate and performance of primiparous Holstein dairy heifers</a>
      <div class="search-results-list__item__description">
        Le Cozler Y, Jurquet J, Bedere N.
      </div>
      <span class="search-results-list__item__meta">
        <span>1 evaluation</span><span>Latest version <time datetime="2019-12-05">Dec 5, 2019</time></span><span>Latest activity <time datetime="2019-12-05">Dec 5, 2019</time></span>
      </span>
    </div>
  </li>
  <li class="search-results-list__item">
    <div class="search-results-list__item_container">
      <a class="search-results-list__item__link" href="/articles/activity/10.1101/661249">Lactation curve model with explicit representation of perturbations as a phenotyping tool for dairy livestock precision farming</a>
      <div class="search-results-list__item__description">
        Ahmed BA, Laurence P, Pierre G, Olivier M.
      </div>
      <span class="search-results-list__item__meta">
        <span>1 evaluation</span><span>Latest version <time datetime="2019-08-27">Aug 27, 2019</time></span><span>Latest activity <time datetime="2019-09-06">Sep 6, 2019</time></span>
      </span>
    </div>
  </li>
</ul>`;

type ArticleViewModel = {
  doi: Doi,
  title: SanitisedHtmlFragment,
  authors: ReadonlyArray<SanitisedHtmlFragment>,
  latestVersionDate: Date,
  latestActivityDate: Date,
  evaluationCount: number,
};

const renderRecentGroupActivity: (
  items: ReadonlyArray<ArticleViewModel>
) => HtmlFragment = () => toHtmlFragment(hardcodedArticleList);

const constructFeed = (ports: Ports, group: Group) => pipe(
  ports.getAllEvents,
  T.chain(flow(
    getMostRecentEvents(group.id, 20),
    T.traverseArray(constructFeedItem(ports.fetchArticle)(group)),
  )),
  T.map(renderFeed),
  TE.rightTask,
);

const constructRecentGroupActivity = () => pipe(
  [],
  renderRecentGroupActivity,
  TE.right,
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
      feed: group.id.value === '4eebcec9-a4bb-44e1-bde3-2ae11e65daaa'
        ? constructRecentGroupActivity()
        : constructFeed(ports, group),
    },
    sequenceS(TE.taskEither),
    TE.bimap(renderErrorPage, renderPage(group)),
  )),
);
