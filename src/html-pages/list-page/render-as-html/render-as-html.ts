import { pipe } from 'fp-ts/function';
import striptags from 'striptags';
import { RawUserInput } from '../../../read-models/annotations/handle-event';
import { toHtmlFragment } from '../../../types/html-fragment';
import { HtmlPage, NotHtml, toHtmlPage } from '../../html-page';
import { ViewModel } from '../view-model';
import { renderPage } from './render-page';

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
