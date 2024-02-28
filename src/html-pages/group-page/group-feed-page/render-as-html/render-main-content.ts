import { pipe } from 'fp-ts/function';
import { renderTabs } from '../../../../shared-components/tabs';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { tabList } from '../../common-components/tab-list';
import { ViewModel } from '../view-model';
import { renderListOfArticleCardsWithFallback } from './render-list-of-article-cards-with-fallback';
import { renderCollectionsSection } from './render-collections-section';

const tabProps = (viewmodel: ViewModel) => ({
  tabList: tabList(viewmodel.tabs),
  activeTabIndex: 0,
});

const augmentWithCollectionsSection = (groupId: ViewModel['group']['id']) => (otherContent: HtmlFragment) => {
  if (groupId === '4bbf0c12-629b-4bb8-91d6-974f4df8efb2') {
    return toHtmlFragment(`
      ${renderCollectionsSection()}
      ${otherContent}
    `);
  }
  return otherContent;
};

const wrapperForTopSpace = (wrapped: HtmlFragment) => toHtmlFragment(`
  <div class="group-page-tab-panel-content">
    ${wrapped}
  </div>
`);

export const renderMainContent = (viewmodel: ViewModel): HtmlFragment => pipe(
  renderListOfArticleCardsWithFallback(viewmodel.content),
  augmentWithCollectionsSection(viewmodel.group.id),
  wrapperForTopSpace,
  renderTabs(tabProps(viewmodel)),
);
