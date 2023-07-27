import { toHtmlFragment } from '../../types/html-fragment';
import { Page } from '../../types/page';

export const subscribeToListPage: Page = {
  title: 'Subscribe to a list',
  content: toHtmlFragment(`
    <header class="page-header">
      <h1>Subscribe to a list</h1>
    </header>

    <p>
      Please note that this is an experimental feature and may be a bit rough around the edges
      while we get things ship-shape.
    </p>

    <script type="text/javascript" src="https://form.jotform.com/jsform/232072517707050"></script>
  `),
};
