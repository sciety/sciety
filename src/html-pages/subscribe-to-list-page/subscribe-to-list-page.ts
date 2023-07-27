import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import { HandlePage } from '../../http/page-handler';
import { toHtmlFragment } from '../../types/html-fragment';

const renderAsHtml = () => toHtmlFragment(`
  <header class="page-header">

    <h1>Subscribe to a list</h1>
  </header>

  <p>
    Please note that this is an experimental feature and may be a bit rough around the edges
    while we get things ship-shape.
  </p>

  <script type="text/javascript" src="https://form.jotform.com/jsform/232072517707050"></script>
`);

export const subscribeToListPage: HandlePage = (params: unknown) => pipe(
  params,
  renderAsHtml,
  (content) => ({
    title: 'Subscribe to a list',
    content,
  }),
  TE.right,
);
