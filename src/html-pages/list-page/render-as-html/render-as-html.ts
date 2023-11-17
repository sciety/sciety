import { pipe } from 'fp-ts/function';
import { toHtmlFragment } from '../../../types/html-fragment.js';
import { HtmlPage } from '../../html-page.js';
import { ViewModel } from '../view-model.js';
import { renderPage } from './render-page.js';

export const renderAsHtml = (viewModel: ViewModel): HtmlPage => ({
  title: viewModel.name,
  openGraph: {
    title: viewModel.name,
    description: viewModel.description,
  },
  description: viewModel.description,
  content: pipe(viewModel, renderPage, toHtmlFragment),
});
