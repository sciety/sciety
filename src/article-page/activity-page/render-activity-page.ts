import { pipe } from 'fp-ts/function';
import { tabs } from '../../shared-components/tabs';
import { Doi } from '../../types/doi';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { tabList } from '../tab-list';

// TODO: replace string with HtmlFragment
export const renderActivityPage = (components: {
  doi: Doi,
  header: HtmlFragment,
  feed: string,
}): HtmlFragment => pipe(
  components.feed,
  toHtmlFragment,
  tabs({
    tabList: tabList(components.doi),
    activeTabIndex: 1,
  }),
  (mainContent) => `
    ${components.header}
    <div class="main-content">
      ${mainContent}
    </div>
  `,
  toHtmlFragment,
);
