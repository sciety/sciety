import { sequenceS } from 'fp-ts/Apply';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { about, Ports as AboutPorts } from './about/about';
import { findFollowers } from './followers/find-followers';
import { followers, Ports as FollowersPorts } from './followers/followers';
import { lists, Ports as ListsPorts } from './lists/lists';
import { Tab, tabs } from '../shared-components/tabs';
import * as DE from '../types/data-error';
import { Group } from '../types/group';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export type Ports = AboutPorts & FollowersPorts & ListsPorts;

export type TabIndex = 0 | 1 | 2;

const tabList = (groupSlug: string, followerCount: number): [Tab, Tab, Tab] => [
  {
    label: toHtmlFragment('Lists (1)'),
    url: `/groups/${groupSlug}/lists`,
  },
  {
    label: toHtmlFragment('About'),
    url: `/groups/${groupSlug}/about`,
  },
  {
    label: toHtmlFragment(`Followers (${followerCount})`),
    url: `/groups/${groupSlug}/followers`,
  },
];

const contentRenderers = (
  ports: Ports,
) => (
  group: Group,
  pageNumber: number,
): Record<TabIndex, TE.TaskEither<DE.DataError, HtmlFragment>> => ({
  0: lists(ports)(group),
  1: about(ports)(group),
  2: followers(ports)(group, pageNumber),
});

type ContentComponent = (
  ports: Ports
) => (
  group: Group,
  pageNumber: number,
  activeTabIndex: TabIndex
) => TE.TaskEither<DE.DataError, HtmlFragment>;

export const contentComponent: ContentComponent = (
  ports,
) => (
  group, pageNumber, activeTabIndex,
) => pipe(
  {
    content: contentRenderers(ports)(group, pageNumber)[activeTabIndex],
    followerCount: pipe(
      ports.getAllEvents,
      T.map(findFollowers(group.id)),
      T.map(RA.size),
      TE.rightTask,
    ),
  },
  sequenceS(TE.ApplyPar),
  TE.map(({ content, followerCount }) => tabs({
    tabList: tabList(group.slug, followerCount),
    activeTabIndex,
  })(content)),
);
