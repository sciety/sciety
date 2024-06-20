import { renderPage } from './render-page';
import { HtmlPage, toHtmlPage } from '../../html-page';
import { ViewModel } from '../view-model';

export const renderAsHtml = (viewModel: ViewModel): HtmlPage => toHtmlPage({
  title: 'Search',
  content: renderPage(viewModel),
});
