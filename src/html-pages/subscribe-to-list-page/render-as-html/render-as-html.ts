import { ViewModel } from '../view-model';
import { renderPage } from './render-page';
import { HtmlPage } from '../../../types/html-page';

export const renderAsHtml = (viewModel: ViewModel): HtmlPage => ({
  title: viewModel.pageHeading,
  content: renderPage(viewModel),
});
