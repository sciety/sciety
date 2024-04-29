import { renderPage } from './render-page';
import { HtmlPage, toHtmlPage } from '../../html-page';
import { ViewModel } from '../view-model';

export const renderAsHtml = (searchResults: ViewModel): HtmlPage => toHtmlPage({
  title: `Search results for ${searchResults.query}`,
  content: renderPage(searchResults),
});
