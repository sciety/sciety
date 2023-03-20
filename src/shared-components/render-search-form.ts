import { htmlEscape } from 'escape-goat';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export const renderSearchForm = (query: string, evaluatedOnly: boolean): HtmlFragment => toHtmlFragment(`
  <form action="/search" method="get" class="search-form">
    <input type="hidden" name="category" value="articles">
    <label for="searchText" class="search-form__text-input-label">Find preprints and evaluating groups</label>
    <div class="search-form__helper_text">
      Search articles by DOI, author or keyword;
      search groups by keyword.
    </div>
    <div class="search-form__positioning_context">
      ${htmlEscape`<input value="${query}" id="searchText" name="query" class="search-form__text">`}
      <section class="search-form__section">
        <input type="checkbox" name="evaluatedOnly" value="true" id="searchEvaluatedOnlyFilter"${evaluatedOnly ? ' checked' : ''}>
        <label for="searchEvaluatedOnlyFilter" class="search-form__label">Search only evaluated articles</label>
      </section>
      <button type="submit" class="search-form__submit" aria-label="Run the search">Search</button>
      <button type="reset" id="clearSearchText" class="search-form__clear visually-hidden">
        <img src="/static/images/clear-search-text-icon.svg" class="search-form__clear_icon" alt="">
      </button>
    </div>
  </form>
`);
