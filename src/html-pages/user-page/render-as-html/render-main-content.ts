import * as RA from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import { flow, identity, pipe } from 'fp-ts/function';
import { renderListCard } from '../../../shared-components/list-card/render-list-card';
import { renderTabs } from '../../../shared-components/tabs';
import { HtmlFragment } from '../../../types/html-fragment';
import { FollowingTab, ViewModel } from '../view-model';
import { tabList } from './tab-list';
import { followingNothing, informationUnavailable } from './static-messages';
import { renderGroupCard } from '../../../shared-components/group-card';
import { renderFollowList } from './render-follow-list';

const tabProps = (viewmodel: ViewModel) => ({
  tabList: tabList(viewmodel.userDetails.handle, viewmodel.groupIds.length),
  activeTabIndex: viewmodel.activeTab.selector === 'lists' ? 0 : 1,
});

const renderFollowedGroups = (viewmodel: FollowingTab) => pipe(
  viewmodel.followedGroups,
  O.map(RA.match(
    () => followingNothing,
    flow(
      RA.map(renderGroupCard),
      renderFollowList,
    ),
  )),
  O.match(
    () => informationUnavailable,
    identity,
  ),
);

const renderActiveTabContents = (viewmodel: ViewModel) => (
  (viewmodel.activeTab.selector === 'lists')
    ? renderListCard(viewmodel.activeTab)
    : renderFollowedGroups(viewmodel.activeTab)
);

export const renderMainContent = (viewmodel: ViewModel): HtmlFragment => pipe(
  renderActiveTabContents(viewmodel),
  renderTabs(tabProps(viewmodel)),
);
