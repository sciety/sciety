import { pipe } from 'fp-ts/function';
import { tabs } from '../../shared-components/tabs';
import { Doi } from '../../types/doi';
import { HtmlFragment } from '../../types/html-fragment';
import { renderPage } from '../render-page';
import { tabList } from '../tab-list';

export const renderActivityPage = (components: {
  doi: Doi,
  header: HtmlFragment,
  mainContent: HtmlFragment,
}): HtmlFragment => pipe(
  components.mainContent,
  tabs({
    tabList: tabList(components.doi),
    activeTabIndex: 1,
  }),
  renderPage(components.header),
);
