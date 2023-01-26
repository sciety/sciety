import { htmlEscape } from 'escape-goat';
import { renderTabs } from '../../../shared-components/tabs';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { ViewModel } from '../view-model';
import { tabList } from './tab-list';

const tabProps = (viewmodel: ViewModel) => ({
  tabList: tabList(viewmodel.user.handle, viewmodel.groupIds.length),
  activeTabIndex: viewmodel.activeTabIndex,
});

export const renderPage = (viewmodel: ViewModel): HtmlFragment => toHtmlFragment(`
  <header class="page-header page-header--user page-header__identity">
    <img src="${viewmodel.user.avatarUrl}" alt="" class="page-header__avatar">
    <h1>
      <span class="visually-hidden">Sciety user </span>${htmlEscape(viewmodel.user.displayName)}
      <div class="page-header__handle">
        <span class="visually-hidden">Twitter handle </span>@${viewmodel.user.handle}
      </div>
    </h1>
  </header>
  <div class="main-content main-content--user">
    ${renderTabs(tabProps(viewmodel))(viewmodel.renderedActiveTabContents)}
  </div>
`);
