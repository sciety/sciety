import { ViewModel } from '../view-model';
import { HtmlPage, toHtmlPage } from '../../html-page';
import { renderPage } from './render-page';

export const renderAsHtml = (viewModel: ViewModel): HtmlPage => toHtmlPage({
  title: 'Lists',
  content: renderPage(viewModel),
});
