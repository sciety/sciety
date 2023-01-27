import { sequenceS } from 'fp-ts/Apply';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { about, Ports as AboutPorts } from './about/about';
import { followers, Ports as FollowersPorts } from './followers/followers';
import { lists } from './lists/lists';
import { Tab, renderTabs } from '../../shared-components/tabs';
import * as DE from '../../types/data-error';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { ContentModel, TabIndex } from './content-model';

export type Ports = AboutPorts & FollowersPorts;

const tabList = (groupSlug: string, listCount: number, followerCount: number): [Tab, Tab, Tab] => [
  {
    label: toHtmlFragment(`<span class="visually-hidden">This group has ${listCount} </span>Lists<span aria-hidden="true"> (${listCount})</span>`),
    url: `/groups/${groupSlug}/lists`,
  },
  {
    label: toHtmlFragment('About'),
    url: `/groups/${groupSlug}/about`,
  },
  {
    label: toHtmlFragment(`<span class="visually-hidden">This group has ${followerCount} </span>Followers<span aria-hidden="true"> (${followerCount})</span>`),
    url: `/groups/${groupSlug}/followers`,
  },
];

const contentRenderers = (
  ports: Ports,
) => (
  contentModel: ContentModel,
): Record<TabIndex, TE.TaskEither<DE.DataError, HtmlFragment>> => ({
  0: lists(contentModel),
  1: about(ports)(contentModel),
  2: followers(ports)(contentModel),
});

type ContentComponent = (ports: Ports) => (contentModel: ContentModel) => TE.TaskEither<DE.DataError, HtmlFragment>;

export const contentComponent: ContentComponent = (ports) => (contentModel) => pipe(
  {
    content: contentRenderers(ports)(contentModel)[contentModel.activeTabIndex],
    listCount: pipe(
      contentModel.lists,
      RA.size,
      TE.right,
    ),
    followerCount: TE.right(contentModel.followers.length),
  },
  sequenceS(TE.ApplyPar),
  TE.map(({ content, listCount, followerCount }) => renderTabs({
    tabList: tabList(contentModel.group.slug, listCount, followerCount),
    activeTabIndex: contentModel.activeTabIndex,
  })(content)),
);
