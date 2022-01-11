import { pipe } from 'fp-ts/function';
import { tabs } from '../../shared-components/tabs';
import { Doi } from '../../types/doi';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { renderHeader } from '../render-header';
import { tabList } from '../tab-list';

// TODO: title should be HtmlFragment and sanitized outside of here
type ArticleDetails = {
  title: string,
};

// TODO: replace string with HtmlFragment
export const renderActivityPage = (components: {
  articleDetails: ArticleDetails,
  doi: Doi,
  feed: string,
  badge: HtmlFragment,
  saveArticle: HtmlFragment,
  tweetThis: HtmlFragment,
}): HtmlFragment => pipe(
  components.feed,
  toHtmlFragment,
  tabs({
    tabList: tabList(components.doi),
    activeTabIndex: 1,
  }),
  (mainContent) => `
    ${renderHeader(components)}

    <div class="main-content">
      ${mainContent}
    </div>
  `,
  toHtmlFragment,
);
