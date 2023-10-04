import { ViewModel } from '../view-model';
import { HtmlPage } from '../../../types/html-page';
import { renderPage } from './render-page';

export const renderAsHtml = (viewModel: ViewModel): HtmlPage => ({
  title: 'Lists',
  content: renderPage(viewModel),
});
