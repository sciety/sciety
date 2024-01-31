import { HtmlPage, toHtmlPage } from '../../html-page';
import { ViewModel } from '../view-model';
import { renderPage } from './render-page';

export const renderAsHtml = (searchResults: ViewModel): HtmlPage => toHtmlPage({
  title: `Search results for ${searchResults.query}`,
  content: renderPage(searchResults),
});
