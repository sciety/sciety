import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { flow, identity, pipe } from 'fp-ts/function';
import { renderFollowList } from './render-follow-list';
import { followingNothing, informationUnavailable } from './static-messages';
import { tabList } from './tab-list';
import { renderGroupCard } from '../../../../read-side/html-pages/shared-components/group-card';
import { renderTabs } from '../../../../shared-components/tabs';
import { HtmlFragment } from '../../../../types/html-fragment';
import { ViewModel } from '../view-model';

const tabProps = (viewmodel: ViewModel) => ({
  tabList: tabList(viewmodel.userDetails.handle, viewmodel.listCount, viewmodel.groupIds.length),
  activeTabIndex: 1,
});

const renderFollowedGroups = (viewmodel: ViewModel) => pipe(
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

export const renderMainContent = (viewmodel: ViewModel): HtmlFragment => pipe(
  renderFollowedGroups(viewmodel),
  renderTabs(tabProps(viewmodel)),
);
