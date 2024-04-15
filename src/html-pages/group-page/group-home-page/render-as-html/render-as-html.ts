import { HtmlPage, toHtmlPage } from '../../../html-page';
import { ViewModel } from '../view-model';
import { renderPage } from './render-page';

export const renderAsHtml = (viewmodel: ViewModel): HtmlPage => toHtmlPage({
  title: viewmodel.header.group.name,
  content: renderPage(viewmodel),
});
