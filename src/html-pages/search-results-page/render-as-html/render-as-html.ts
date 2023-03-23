import { SearchResults } from '../render-search-results';
import { Page } from '../../../types/page';
import { renderPage } from './render-page';

export const renderAsHtml = (searchResults: SearchResults): Page => ({
  title: `Search results for ${searchResults.query}`,
  content: renderPage(searchResults),
});
