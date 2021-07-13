import { htmlEscape } from 'escape-goat';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { renderExampleSearches } from './render-example-searches';

export const renderSearchForm = (query: string): HtmlFragment => toHtmlFragment(`
  <div class="search-form">
    <form action="/search" method="get" class="search-form__form">
      <input type="hidden" name="category" value="articles">
      <label for="searchText" class="visually-hidden">Search term</label>
      ${htmlEscape`<input value="${query}" id="searchText" name="query" placeholder="Find articles and evaluating groups…" class="search-form__text">`}
      <button type="reset" id="clearSearchText" class="search-form__clear visually-hidden">
        <img src="/static/images/clear-search-text-icon.svg" class="search-form__clear_icon" alt="">
      </button>
      <button type="submit" class="visually-hidden">Search</button>
    </form>
    ${renderExampleSearches()}
  </div>
`);
