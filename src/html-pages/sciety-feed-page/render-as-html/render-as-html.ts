import { HtmlPage, toHtmlPage } from '../../html-page';
import { ViewModel } from '../view-model';
import { renderPage } from './render-page';

export const renderAsHtml = (viewModel: ViewModel): HtmlPage => toHtmlPage({
  title: viewModel.pageHeading,
  content: renderPage(viewModel),
});
