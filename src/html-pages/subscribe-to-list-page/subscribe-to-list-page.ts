import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import { HandlePage } from '../../http/page-handler';
import { toHtmlFragment } from '../../types/html-fragment';
import { toErrorPage } from './render-as-html/to-error-page';
import { Queries } from '../../shared-read-models';
import { ViewModel } from './view-model';
import { constructViewModel } from './construct-view-model/construct-view-model';

const renderAsHtml = (viewModel: ViewModel) => toHtmlFragment(`
  <header class="page-header">

    <h1>Subscribe to ${viewModel.listName}</h1>
  </header>

  <section class="subscribe-content">
    <p>
      Here you can subscribe to <a href="${viewModel.listLink}">${viewModel.listName}</a>.
    </p>
  </section>

  <script type="text/javascript" src="https://form.jotform.com/jsform/232072517707050?listId=${viewModel.listId}"></script>
`);

export const subscribeToListPage = (dependencies: Queries): HandlePage => (params: unknown) => pipe(
  params,
  constructViewModel(dependencies),
  TE.bimap(
    toErrorPage,
    renderAsHtml,
  ),
  TE.map((content) => ({
    title: 'Subscribe to a list',
    content,
  })),
);
