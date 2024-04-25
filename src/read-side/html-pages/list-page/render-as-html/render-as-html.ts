import { pipe } from 'fp-ts/function';
import striptags from 'striptags';
import { renderPage } from './render-page';
import { HtmlPage, NotHtml, toHtmlPage } from '../../../../html-pages/html-page';
import { toHtmlFragment } from '../../../../types/html-fragment';
import { RawUserInput } from '../../../raw-user-input';
import { ViewModel } from '../view-model';

const stripHtml = (input: RawUserInput): NotHtml => striptags(input.content) as NotHtml;

export const renderAsHtml = (viewModel: ViewModel): HtmlPage => toHtmlPage({
  title: viewModel.name,
  openGraph: {
    title: viewModel.name,
    description: stripHtml(viewModel.description),
  },
  description: stripHtml(viewModel.description),
  content: pipe(viewModel, renderPage, toHtmlFragment),
});
