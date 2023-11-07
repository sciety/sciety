import { pipe } from 'fp-ts/function';
import { toHtmlFragment } from '../../../types/html-fragment';
import { HtmlPage } from '../../html-page';
import { ViewModel } from '../view-model';
import { renderPage } from './render-page';

export const renderAsHtml = (viewModel: ViewModel): HtmlPage => ({
  title: viewModel.name,
  openGraph: {
    title: viewModel.name,
    description: viewModel.description,
  },
  description: viewModel.description,
  content: pipe(viewModel, renderPage, toHtmlFragment),
});
