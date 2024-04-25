import { renderPage } from './render-page';
import { HtmlPage, toHtmlPage } from '../../../../html-pages/html-page';
import { ViewModel } from '../view-model';

export const renderAsHtml = (viewModel: ViewModel): HtmlPage => toHtmlPage({
  title: 'Lists',
  content: renderPage(viewModel),
});
