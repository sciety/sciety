import { HtmlPage } from '../../../types/html-page';
import { ViewModel } from '../view-model';
import { renderPage } from './render-page';

export const renderAsHtml = (viewModel: ViewModel): HtmlPage => ({
  title: 'Sciety Feed',
  content: renderPage(viewModel),
});
