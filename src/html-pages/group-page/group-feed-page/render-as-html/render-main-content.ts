import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { renderTabs } from '../../../../shared-components/tabs';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { tabList } from '../../common-components/tab-list';
import { ViewModel } from '../view-model';
import { renderListOfArticleCardsWithFallback } from './render-list-of-article-cards-with-fallback';
import { renderCollectionsSection } from './render-collections-section';
import { wrapperForTopSpace } from '../../wrapper-for-top-space';
import { ListCardViewModel } from '../../../../shared-components/list-card';
import * as LID from '../../../../types/list-id';
import { rawUserInput } from '../../../../read-models/annotations/handle-event';

const tabProps = (viewmodel: ViewModel) => ({
  tabList: tabList(viewmodel.tabs),
  activeTabIndex: 0,
});

const conciergedBiophysicsColabUserListCard: ListCardViewModel = {
  listId: LID.fromValidatedString('454ba80f-e0bc-47ed-ba76-c8f872c303d2'),
  articleCount: 706,
  updatedAt: O.some(new Date('2024-02-22')),
  title: 'Reading list',
  description: rawUserInput('Articles that are being read by Biophysics Colab.'),
  avatarUrl: O.some('https://pbs.twimg.com/profile_images/1417582635040317442/jYHfOlh6_normal.jpg'),
};

const augmentWithCollectionsSection = (viewmodel: ViewModel) => (otherContent: HtmlFragment) => {
  if (viewmodel.group.id === '4bbf0c12-629b-4bb8-91d6-974f4df8efb2') {
    return toHtmlFragment(`
      ${renderCollectionsSection(conciergedBiophysicsColabUserListCard)}
      ${otherContent}
    `);
  }
  return otherContent;
};

export const renderMainContent = (viewmodel: ViewModel): HtmlFragment => pipe(
  renderListOfArticleCardsWithFallback(viewmodel.content),
  augmentWithCollectionsSection(viewmodel),
  wrapperForTopSpace,
  renderTabs(tabProps(viewmodel)),
);
