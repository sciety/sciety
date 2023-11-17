import { pipe } from 'fp-ts/function';
import { renderTabs } from '../../../../shared-components/tabs/index.js';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment.js';
import { tabList } from '../../common-components/tab-list.js';
import { ViewModel } from '../view-model.js';
import { renderOurLists } from './render-our-lists.js';
import { renderDescription } from './render-description.js';

const tabProps = (viewmodel: ViewModel) => ({
  tabList: tabList(viewmodel.tabs),
  activeTabIndex: 2,
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
