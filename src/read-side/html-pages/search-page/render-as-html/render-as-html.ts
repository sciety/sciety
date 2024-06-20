import { renderPage } from './render-page';
import { HtmlPage, toHtmlPage } from '../../html-page';

export const renderAsHtml = (): HtmlPage => toHtmlPage({
  title: 'Search',
  content: renderPage(),
});
