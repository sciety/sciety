import { htmlEscape } from 'escape-goat';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';

export const renderSearchForm = (query: string, evaluatedOnly: boolean): HtmlFragment => toHtmlFragment(`
  <section>
    <h2>Find preprints</h2>
    <form action="/search" method="get" class="search-form">
      <label for="searchText" class="search-form__label">
        Search articles by DOI, author or keyword.
      </label>
      <div class="search-form__positioning_context">
        ${htmlEscape`<input value="${query}" id="searchText" name="query" class="standard-form__full_width_text_input">`}
        <section>
          <input type="checkbox" name="evaluatedOnly" value="true" id="searchEvaluatedOnlyFilter"${evaluatedOnly ? ' checked' : ''}>
          <label for="searchEvaluatedOnlyFilter" class="search-form__checkbox_label">Search only evaluated articles</label>
        </section>
        <button type="submit" class="search-form__submit" aria-label="Run the search">Search</button>
        <button type="reset" id="clearSearchText" class="search-form__clear visually-hidden">
          <img src="/static/images/clear-search-text-icon.svg" class="search-form__clear_icon" alt="">
        </button>
      </div>
    </form>
  </section>
`);
