import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { renderOurLists } from './render-our-lists';
import { renderDescription } from './render-description';
import { AboutTab } from '../view-model';

export const renderAboutTab = (viewmodel: AboutTab): HtmlFragment => toHtmlFragment(`
  <div class="group-page-about">
    <section>
      ${renderOurLists(viewmodel.ourLists)}
    </section>
    <section>
      ${renderDescription(viewmodel.markdown)}
    </section>
  </div>
`);
