import { pipe } from 'fp-ts/function';
import striptags from 'striptags';
import { toHtmlFragment } from '../../../types/html-fragment';
import { HtmlPage, NotHtml } from '../../html-page';
import { ViewModel } from '../view-model';
import { renderPage } from './render-page';

export const renderAsHtml = (viewModel: ViewModel): HtmlPage => ({
  title: viewModel.name,
  openGraph: {
    title: viewModel.name,
    description: striptags(viewModel.description.content) as NotHtml,
  },
  description: striptags(viewModel.description.content) as NotHtml,
  content: pipe(viewModel, renderPage, toHtmlFragment),
});
