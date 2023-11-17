import { ViewModel } from '../view-model.js';
import { HtmlPage } from '../../html-page.js';
import { renderPage } from './render-page.js';

export const renderAsHtml = (viewModel: ViewModel): HtmlPage => ({
  title: 'Lists',
  content: renderPage(viewModel),
});
