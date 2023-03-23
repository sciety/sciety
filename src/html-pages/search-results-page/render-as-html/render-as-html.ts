import { Page } from '../../../types/page';
import { ViewModel } from '../view-model';
import { renderPage } from './render-page';

export const renderAsHtml = (searchResults: ViewModel): Page => ({
  title: `Search results for ${searchResults.query}`,
  content: renderPage(searchResults),
});
