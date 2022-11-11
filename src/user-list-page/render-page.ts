import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';

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

export const renderPage = (viewModel: ViewModel): Page => ({
  title: viewModel.title,
  content: pipe(viewModel, render, toHtmlFragment),
});
