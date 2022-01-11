import { pipe } from 'fp-ts/function';
import { renderMetaContent } from './render-meta-content';
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
}): HtmlFragment => pipe(
  renderMetaContent(components.articleDetails, components.doi),
  tabs({
    tabList: tabList(components.doi),
    activeTabIndex: 0,
  }),
  renderPage(components.header),
);
