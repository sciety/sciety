import { pipe } from 'fp-ts/function';
import * as DE from '../types/data-error';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

type ViewModel = {
  title: string,
  header: HtmlFragment,
  content: HtmlFragment,
  supplementary?: HtmlFragment,
};

type Render = (viewModel: ViewModel) => HtmlFragment;

const render: Render = ({ header, content, supplementary = toHtmlFragment('') }) => toHtmlFragment(`
  ${header}
  <section>
    ${content}
  </section>
  ${supplementary}
`);

export const renderErrorPage = (e: DE.DataError): RenderPageError => pipe(
  e,
  DE.fold({
    notFound: () => 'We couldn\'t find this information.',
    unavailable: () => 'We couldn\'t retrieve this information. Please try again.',
  }),
  toHtmlFragment,
  (message) => ({
    type: e,
    message,
  }),
);

export const renderPage = (viewModel: ViewModel): Page => ({
  title: viewModel.title,
  content: pipe(viewModel, render, toHtmlFragment),
});
