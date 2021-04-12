import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
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
import { ArticleViewModel, renderRecentGroupActivity } from './renderRecentGroupActivity';
import { renderFollowToggle } from '../follow/render-follow-toggle';
import { Doi } from '../types/doi';
import { Group } from '../types/group';
import { GroupId } from '../types/group-id';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';
import { sanitise } from '../types/sanitised-html-fragment';
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

const constructFeed = (ports: Ports, group: Group) => pipe(
  ports.getAllEvents,
  T.chain(flow(
    getMostRecentEvents(group.id, 20),
    T.traverseArray(constructFeedItem(ports.fetchArticle)(group)),
  )),
  T.map(renderFeed),
  TE.rightTask,
);

const hardCodedViewModels: ReadonlyArray<ArticleViewModel> = [
  {
    doi: new Doi('10.1101/2020.09.15.286153'),
    title: pipe('Accuracy of predicting chemical body composition of growing pigs using dual-energy X-ray absorptiometry', toHtmlFragment, sanitise),
    authors: pipe(['Kasper C', 'Schlegel P', 'Ruiz-Ascacibar I', 'Stoll P', 'Bee G'], RA.map(flow(toHtmlFragment, sanitise))),
    latestVersionDate: new Date('2020-12-14'),
    latestActivityDate: new Date('2020-12-15'),
    evaluationCount: 1,
  },
  {
    doi: new Doi('10.1101/2019.12.20.884056'),
    title: pipe('Determining insulin sensitivity from glucose tolerance tests in Iberian and Landrace pigs', toHtmlFragment, sanitise),
    authors: pipe(['Rodríguez-López J', 'Lachica M', 'González-Valero L', 'Fernández-Fígares I'], RA.map(flow(toHtmlFragment, sanitise))),
    latestVersionDate: new Date('2020-10-14'),
    latestActivityDate: new Date('2021-03-10'),
    evaluationCount: 4,
  },
  {
    doi: new Doi('10.1101/760082'),
    title: pipe('Effects of feeding treatment on growth rate and performance of primiparous Holstein dairy heifers', toHtmlFragment, sanitise),
    authors: pipe(['Le Cozler Y', 'Jurquet J', 'Bedere N'], RA.map(flow(toHtmlFragment, sanitise))),
    latestVersionDate: new Date('2019-12-05'),
    latestActivityDate: new Date('2019-12-05'),
    evaluationCount: 1,
  },
  {
    doi: new Doi('10.1101/661249'),
    title: pipe('Lactation curve model with explicit representation of perturbations as a phenotyping tool for dairy livestock precision farming', toHtmlFragment, sanitise),
    authors: pipe(['Ahmed BA', 'Laurence P', 'Pierre G', 'Olivier M'], RA.map(flow(toHtmlFragment, sanitise))),
    latestVersionDate: new Date('2019-08-27'),
    latestActivityDate: new Date('2019-12-05'),
    evaluationCount: 1,
  },
];

const constructRecentGroupActivity = () => pipe(
  hardCodedViewModels,
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
