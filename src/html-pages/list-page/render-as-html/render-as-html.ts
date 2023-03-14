import { pipe } from 'fp-ts/function';
import { toHtmlFragment } from '../../../types/html-fragment';
import { Page } from '../../../types/page';
import { ViewModel } from '../view-model';
import { renderPage } from './render-page';

export const renderAsHtml = (viewModel: ViewModel): Page => ({
  title: viewModel.name,
  openGraph: {
    title: viewModel.name,
    description: viewModel.description,
  },
  description: viewModel.description,
  content: pipe(viewModel, renderPage, toHtmlFragment),
});
