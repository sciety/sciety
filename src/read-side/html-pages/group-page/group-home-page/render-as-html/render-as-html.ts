import { renderPage } from './render-page';
import { HtmlPage, toHtmlPage } from '../../../../../html-pages/html-page';
import { ViewModel } from '../view-model';

export const renderAsHtml = (viewmodel: ViewModel): HtmlPage => toHtmlPage({
  title: viewmodel.header.group.name,
  content: renderPage(viewmodel),
});
