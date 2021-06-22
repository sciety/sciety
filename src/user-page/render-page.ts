import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';

type Components = {
  header: HtmlFragment,
  tabs: HtmlFragment,
  userDisplayName: string,
};

export const renderPage = (components: Components): Page => ({
  title: components.userDisplayName,
  content: toHtmlFragment(`
    <div class="page-content__background">
      <article class="sciety-grid sciety-grid--user">
        ${components.header}

        <div class="main-content main-content--user">
          ${components.tabs}
        </div>

      </article>
    </div>
  `),
});
