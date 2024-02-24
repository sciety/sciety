import { ViewModel } from '../view-model.js';
import { renderPage } from './render-page.js';
import { HtmlPage, toHtmlPage } from '../../html-page.js';

export const renderAsHtml = (viewModel: ViewModel): HtmlPage => toHtmlPage({
  title: viewModel.pageHeading,
  content: renderPage(viewModel),
});
