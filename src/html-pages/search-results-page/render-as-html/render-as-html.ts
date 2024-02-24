import { HtmlPage, toHtmlPage } from '../../html-page.js';
import { ViewModel } from '../view-model.js';
import { renderPage } from './render-page.js';

export const renderAsHtml = (searchResults: ViewModel): HtmlPage => toHtmlPage({
  title: `Search results for ${searchResults.query}`,
  content: renderPage(searchResults),
});
