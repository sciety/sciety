import { pipe } from 'fp-ts/function';
import { tabs } from '../../shared-components/tabs';
import { ArticleAuthors } from '../../types/article-authors';
import { Doi } from '../../types/doi';
import { HtmlFragment } from '../../types/html-fragment';
import { renderPage } from '../render-page';
import { tabList } from '../tab-list';

type ArticleDetails = {
  abstract: HtmlFragment,
  authors: ArticleAuthors,
};

export const renderMetaPage = (components: {
  doi: Doi,
  header: HtmlFragment,
  articleDetails: ArticleDetails,
  mainContent: HtmlFragment,
}): HtmlFragment => pipe(
  components.mainContent,
  tabs({
    tabList: tabList(components.doi),
    activeTabIndex: 0,
  }),
  renderPage(components.header),
);
