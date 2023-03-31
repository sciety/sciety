import { pipe } from 'fp-ts/function';
import { renderTabs } from '../../../../shared-components/tabs';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { tabList } from '../../common-components/tab-list';
import { ViewModel } from '../view-model';
import { renderOurLists } from './render-our-lists';
import { renderDescription } from './render-description';

const tabProps = (viewmodel: ViewModel) => ({
  tabList: tabList(viewmodel.tabs),
  activeTabIndex: 1,
});

export const renderMainContent = (viewmodel: ViewModel): HtmlFragment => pipe(
  `
    <div class="group-page-about">
      <section>
        ${renderOurLists(viewmodel.ourLists)}
      </section>
      <section>
        ${renderDescription(viewmodel.markdown)}
      </section>
    </div>
  `,
  toHtmlFragment,
  renderTabs(tabProps(viewmodel)),
);
