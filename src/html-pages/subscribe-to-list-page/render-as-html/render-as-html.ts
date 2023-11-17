import { ViewModel } from '../view-model.js';
import { renderPage } from './render-page.js';
import { HtmlPage } from '../../html-page.js';

export const renderAsHtml = (viewModel: ViewModel): HtmlPage => ({
  title: viewModel.pageHeading,
  content: renderPage(viewModel),
});
