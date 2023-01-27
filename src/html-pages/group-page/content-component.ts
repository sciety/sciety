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

const tabList = (contentModel: ContentModel): [Tab, Tab, Tab] => [
  {
    label: toHtmlFragment(`<span class="visually-hidden">This group has ${contentModel.lists.length} </span>Lists<span aria-hidden="true"> (${contentModel.lists.length})</span>`),
    url: `/groups/${contentModel.group.slug}/lists`,
  },
  {
    label: toHtmlFragment('About'),
    url: `/groups/${contentModel.group.slug}/about`,
  },
  {
    label: toHtmlFragment(`<span class="visually-hidden">This group has ${contentModel.followers.length} </span>Followers<span aria-hidden="true"> (${contentModel.followers.length})</span>`),
    url: `/groups/${contentModel.group.slug}/followers`,
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
  contentRenderers(ports)(contentModel)[contentModel.activeTabIndex],
  TE.map(renderTabs({
    tabList: tabList(contentModel),
    activeTabIndex: contentModel.activeTabIndex,
  })),
);
