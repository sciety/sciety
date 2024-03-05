import { pipe } from 'fp-ts/function';
import { renderTabs } from '../../../../shared-components/tabs';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { tabList } from '../../common-components/tab-list';
import { ViewModel } from '../view-model';
import { renderOurLists } from './render-our-lists';
import { renderDescription } from './render-description';
import { wrapperForTopSpace } from '../../common-components/wrapper-for-top-space';

const tabProps = (viewmodel: ViewModel) => ({
  tabList: tabList(viewmodel.tabs),
  activeTabIndex: 2,
});

export const renderMainContent = (viewmodel: ViewModel): HtmlFragment => pipe(
  `
    <section>
      ${renderOurLists(viewmodel.ourLists)}
    </section>
    <section>
      ${renderDescription(viewmodel.markdown)}
    </section>
  `,
  toHtmlFragment,
  wrapperForTopSpace,
  renderTabs(tabProps(viewmodel)),
);
