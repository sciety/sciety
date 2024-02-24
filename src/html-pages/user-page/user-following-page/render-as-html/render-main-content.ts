import * as RA from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import { flow, identity, pipe } from 'fp-ts/function';
import { renderTabs } from '../../../../shared-components/tabs/index.js';
import { HtmlFragment } from '../../../../types/html-fragment.js';
import { ViewModel } from '../view-model.js';
import { tabList } from './tab-list.js';
import { followingNothing, informationUnavailable } from './static-messages.js';
import { renderGroupCard } from '../../../../shared-components/group-card/index.js';
import { renderFollowList } from './render-follow-list.js';

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
